/* Maps string names (from data) to lucide-react icon components.
   Keeps the data files free of imports and lets us swap emojis for
   real, consistent line icons everywhere. */
import {
  Globe,
  Smartphone,
  Bot,
  MessageSquare,
  PenTool,
  Rocket,
  Zap,
  GraduationCap,
  Check,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  Plus,
  Minus,
  ShieldCheck,
  PlayCircle,
  ChevronLeft,
  Lock,
} from "lucide-react";

const MAP = {
  Globe,
  Smartphone,
  Bot,
  MessageSquare,
  PenTool,
  Rocket,
  Zap,
  GraduationCap,
  Check,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  Plus,
  Minus,
  ShieldCheck,
  PlayCircle,
  ChevronLeft,
  Lock,
};

/* <Icon name="Globe" size={20} ... /> */
export default function Icon({ name, ...props }) {
  const Cmp = MAP[name];
  if (!Cmp) return null;
  return <Cmp {...props} />;
}
