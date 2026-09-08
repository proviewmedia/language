import {
  Smile,
  Sparkles,
  Layers,
  LifeBuoy,
  Hash,
  User,
  MessageCircle,
  Briefcase,
  Car,
  BedDouble,
  UtensilsCrossed,
  ShoppingBag,
  MapPin,
  Flag,
  type LucideIcon,
} from "lucide-react";

// Ported from app.html's MODULE_ICON_MAP, so the goal-step icon matches
// what the same module shows everywhere else in the app.
export const MODULE_ICONS: Record<string, LucideIcon> = {
  e1: Smile,
  e2: Sparkles,
  e3: Layers,
  e4: LifeBuoy,
  e5: Hash,
  e6: User,
  e7: MessageCircle,
  s1: Briefcase,
  s2: Car,
  s3: BedDouble,
  s4: UtensilsCrossed,
  s5: ShoppingBag,
  s6: MapPin,
  s7: LifeBuoy,
  s8: MessageCircle,
  trip: Flag,
};
