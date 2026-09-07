"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AssessmentAnswer, ChatMessage, Doctor, SkinResult } from "./types";
import { supabase } from "./supabase";
import { logEvent } from "./analytics";
import { compressImageDataUrl } from "./compress-image";

/** How long we'll wait for /api/analyze before giving up and telling the user. */
const ANALYZE_TIMEOUT_MS = 45_000;

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
        const photoMsgId = nextId();

        // Compress first, before this huge data URL touches state, Supabase,
        // or OpenAI. A raw phone photo can be 5-15MB; this is the main fix
        // for the multi-minute "analyzing" waits.
        let compressedImage: string;
        try {
          compressedImage = await compressImageDataUrl(imageDataUrl);
        } catch (err) {
          console.error("Image compression failed, falling back to original:", err);
          compressedImage = imageDataUrl;
        }

        const photoMsg: ChatMessage = {
          id: photoMsgId,
          role: "user",
          kind: "image",
          imageUrl: compressedImage,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ messages: [...s.messages, photoMsg] }));

        set({ phase: "photo-review" });
        get().push({
          role: "assistant",
          kind: "text",
          text: "Thank you. I'm taking a closer look at your skin. This usually takes a moment.",
        });

        try {
          const {
            data: { user: authUser },
          } = await supabase.auth.getUser();

          let publicImageUrl = compressedImage;

          if (authUser) {
            const res = await fetch(compressedImage);
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

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), ANALYZE_TIMEOUT_MS);

          let response: Response;
          try {
            response = await fetch("/api/analyze", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                imageUrl: publicImageUrl,
                questionnaire: {
                  source: "photo-only",
                  note: "Initial photo analysis before questionnaire",
                },
              }),
              signal: controller.signal,
            });
          } finally {
            clearTimeout(timeoutId);
          }

          const data = await response.json();
          if (!data.success) throw new Error(data.error);

          if (data.invalid) {
            logEvent("assessment_invalid_image");
            get().push({
              role: "assistant",
              kind: "text",
              text: data.result.chael_message,
            });
            set({ phase: "chatting" });
            return;
          }

          const result = data.result;

          logEvent("assessment_completed", {
            severity: result.severity,
            see_derm: result.see_derm,
          });

          get().push({ role: "assistant", kind: "text", text: result.chael_message });
          get().push({
            role: "assistant",
            kind: "choice-summary",
            text: "Would you like me to ask a few questions to better understand possible contributors?",
            meta: {
              choices: [
                { id: "continue", label: "yes, let's continue", href: "/chat/assessment" },
                { id: "later", label: "not now" },
              ],
            },
          });

          set({ phase: "chatting", currentResult: result });

          if (authUser) {
            const filePath = `${authUser.id}/${Date.now()}`;

            const { error: saveError } = await supabase.from("assessments").insert({
              user_id: authUser.id,
              photo_url: publicImageUrl,
              photo_path: filePath,
              questionnaire: {
                source: "photo-only",
                note: "Initial photo analysis before questionnaire",
              },
              result: result,
              lesion_type: result.condition,
              location: result.location,
              severity: result.severity,
              contributors: result.contributors,
              summary: result.summary,
              explanation: result.explanation,
              see_derm: result.see_derm,
              derm_reason: result.derm_reason,
              pih_present:
                result.explanation?.toLowerCase().includes("pih") ||
                result.explanation?.toLowerCase().includes("hyperpigmentation") ||
                false,
            });

            if (saveError) {
              console.error("Save assessment error:", saveError);
            }
          }
        } catch (error) {
          console.error("Analysis error:", error);
          const timedOut = error instanceof DOMException && error.name === "AbortError";
          get().push({
            role: "assistant",
            kind: "text",
            text: timedOut
              ? "That's taking longer than it should. Mind trying again, maybe with a clearer or well-lit photo?"
              : "I had trouble analyzing that photo. Could you try uploading it again?",
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
  recordAnswer: (answer: AssessmentAnswer, total: number) => void;
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  questionIndex: 0,
  answers: [],
  recordAnswer: (answer, total) => {
    const answers = [...get().answers.filter((a) => a.questionId !== answer.questionId), answer];
    const nextIndex = Math.min(get().questionIndex + 1, total);
    set({ answers, questionIndex: nextIndex });
  },
  resetAssessment: () => set({ questionIndex: 0, answers: [] }),
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