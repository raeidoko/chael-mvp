import { HeartHandshake, MessageCircle, UserRound } from "lucide-react";

export const navItems = [
  { href: "/care", label: "care", icon: HeartHandshake },
  { href: "/chat", label: "chat", icon: MessageCircle },
  { href: "/you", label: "me", icon: UserRound },
] as const;
