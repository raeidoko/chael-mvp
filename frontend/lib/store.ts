"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AssessmentAnswer, ChatMessage, SkinResult } from "./types";
import { supabase } from "./supabase";
import { logEvent } from "./analytics";
import { compressImage } from "./compress-image";

let idCounter = 0;
const nextId = () => `msg-${Date.now()}-${idCounter++}`;

export type ChatPhase = "idle" | "photo-review" | "chatting";

interface ChatState {
  messages: ChatMessage[];
  phase: ChatPhase;
  hasStarted: boolean;
  currentResult: SkinResult | null;
  init: () => void;
  push: (msg: Omit<ChatMessage, "id" | "createdAt">) => void;
  uploadPhoto: (imageUrl: string) => void;
  sendUserText: (text: string) => void;
  pushResultsToChat: () => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      phase: "idle",
      hasStarted: false,
      currentResult: null,

      push: (msg) => {
        const full: ChatMessage = { ...msg, id: nextId(), createdAt: new Date().toISOString() };
        set((s) => ({ messages: [...s.messages, full] }));
      },

      init: () => {
        if (get().hasStarted) return;
        set({ hasStarted: true });
        logEvent("session_started");
        get().push({ role: "assistant", kind: "text", text: "Hi, I'm Chael." });
        get().push({
          role: "assistant",
          kind: "upload-prompt",
          text: "How has your skin been feeling today?",
        });
      },

      uploadPhoto: async (imageDataUrl) => {
        const compressedDataUrl = await compressImage(imageDataUrl);

        const photoMsgId = nextId();
        const photoMsg: ChatMessage = {
          id: photoMsgId,
          role: "user",
          kind: "image",
          imageUrl: compressedDataUrl,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ messages: [...s.messages, photoMsg] }));

        set({ phase: "photo-review" });
        get().push({
          role: "assistant",
          kind: "text",
          text: "Thank you. Taking a quick look.",
        });

        try {
          const {
            data: { user: authUser },
          } = await supabase.auth.getUser();

          let publicImageUrl = compressedDataUrl;

          if (authUser) {
            const res = await fetch(compressedDataUrl);
            const blob = await res.blob();
            const fileExt = blob.type.split("/")[1] || "jpg";
            const filePath = `${authUser.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
              .from("skin-photos")
              .upload(filePath, blob, { contentType: blob.type });

            if (uploadError) {
              console.error("Photo upload error:", uploadError);
            } else {
              const { data: publicUrlData } = supabase.storage
                .from("skin-photos")
                .getPublicUrl(filePath);
              publicImageUrl = publicUrlData.publicUrl;

              set((s) => ({
                messages: s.messages.map((m) =>
                  m.id === photoMsgId ? { ...m, imageUrl: publicImageUrl } : m
                ),
              }));
            }
          }

          const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl: publicImageUrl }),
          });

          const data = await response.json();
          if (!data.success) throw new Error(data.error);

          const raw = data.raw;

          if (raw.valid_image === false) {
            logEvent("assessment_invalid_image");
            get().push({
              role: "assistant",
              kind: "text",
              text: raw.invalid_reason ?? "I can't get a clear read on that photo, can you try a clearer one?",
            });
            set({ phase: "chatting" });
            return;
          }

          useAssessmentStore.getState().setVisibleFindings({
            ...raw.visible_findings,
            photo_url: publicImageUrl,
          });

          get().push({ role: "assistant", kind: "text", text: raw.quick_note });
          get().push({
            role: "assistant",
            kind: "choice-summary",
            text: "I've got a first look, now I want to ask a few quick questions so I can actually tell you what's likely going on, not just guess.",
            meta: {
              choices: [
                { id: "continue", label: "let's do it", href: "/chat/full/assessment" },
              ],
            },
          });

          set({ phase: "chatting" });
        } catch (error) {
          console.error("Analysis error:", error);
          get().push({
            role: "assistant",
            kind: "text",
            text: "I had trouble looking at that photo. Could you try uploading it again?",
          });
          set({ phase: "chatting" });
        }
      },

      sendUserText: async (text) => {
        if (!text.trim()) return;
        get().push({ role: "user", kind: "text", text });
        set({ phase: "chatting" });

        const history = get()
          .messages.filter((m) => m.kind === "text")
          .slice(0, -1)
          .map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.text ?? "",
          }));

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text, history }),
          });

          const data = await response.json();

          get().push({
            role: "assistant",
            kind: "text",
            text: data.reply,
          });
        } catch (error) {
          console.error("Chat error:", error);
          get().push({
            role: "assistant",
            kind: "text",
            text: "I didn't catch that. Could you try again?",
          });
        }
      },

      pushResultsToChat: () => {
        const result = get().currentResult;
        get().push({ role: "assistant", kind: "results", meta: { result } });
        get().push({
          role: "assistant",
          kind: "text",
          text: "Would you like me to explain why I think this?",
        });
        get().push({
          role: "assistant",
          kind: "save-prompt",
          text: "Want to save this and get your personalized plan?",
        });
      },

      reset: () => set({ messages: [], phase: "idle", hasStarted: false }),
    }),
    {
      name: "chael-chat-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        ...state,
        messages: state.messages.map((m) =>
          m.kind === "image" && m.imageUrl?.startsWith("data:")
            ? { ...m, imageUrl: "[photo uploading...]" }
            : m
        ),
      }),
    }
  )
);

interface AssessmentState {
  questionIndex: number;
  answers: AssessmentAnswer[];
  visibleFindings: any | null;
  recordAnswer: (answer: AssessmentAnswer, total: number) => void;
  setVisibleFindings: (findings: any) => void;
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  questionIndex: 0,
  answers: [],
  visibleFindings: null,
  recordAnswer: (answer, total) => {
    const answers = [...get().answers.filter((a) => a.questionId !== answer.questionId), answer];
    const nextIndex = Math.min(get().questionIndex + 1, total);
    set({ answers, questionIndex: nextIndex });
  },
  setVisibleFindings: (findings) => set({ visibleFindings: findings }),
  resetAssessment: () => set({ questionIndex: 0, answers: [], visibleFindings: null }),
}));

interface AppState {
  consentAnalyze: boolean;
  consentImprove: boolean;
  setConsent: (analyze: boolean, improve: boolean) => void;
  onboarded: boolean;
  completeOnboarding: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      consentAnalyze: true,
      consentImprove: false,
      setConsent: (analyze, improve) => set({ consentAnalyze: analyze, consentImprove: improve }),
      onboarded: false,
      completeOnboarding: () => set({ onboarded: true }),
    }),
    { name: "chael-app-store" }
  )
);