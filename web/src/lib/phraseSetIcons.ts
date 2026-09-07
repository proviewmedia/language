import {
  Smile,
  User,
  MessageCircle,
  UtensilsCrossed,
  Map,
  Hash,
  type LucideIcon,
} from "lucide-react";

// Same icon choices as app.html's PHRASE_SET_ICON_MAP, keyed by phrase-set id.
export const PHRASE_SET_ICONS: Record<string, LucideIcon> = {
  greetings: Smile,
  intro: User,
  basics: MessageCircle,
  food: UtensilsCrossed,
  directions: Map,
  numbers: Hash,
};
