import {
  Briefcase,
  Car,
  BedDouble,
  UtensilsCrossed,
  ShoppingBag,
  MapPin,
  LifeBuoy,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

// Same icon choices as the marketing page's curriculum grid, keyed by
// scenario id, so the app and the marketing site feel like one product.
export const SCENARIO_ICONS: Record<string, LucideIcon> = {
  s1: Briefcase,
  s2: Car,
  s3: BedDouble,
  s4: UtensilsCrossed,
  s5: ShoppingBag,
  s6: MapPin,
  s7: LifeBuoy,
  s8: MessageCircle,
};
