/* Homepage data: core dev services, course, setup pricing, FAQ.
   JBUIT = software development company (web, mobile, AI automation
   & integrations). Sales AI is our product; the course is a supporting
   offering. Icons reference lucide-react component names (see iconMap). */

export const SERVICES = [
  {
    icon: "Globe",
    title: "Web Development",
    headline: "Build a website that grows your business",
    desc: "We design modern, responsive, high-converting websites that make your brand stand out online and turn visitors into paying customers.",
    features: ["Business Websites", "E-commerce Stores", "Landing Pages", "Portfolio Websites"],
    price: "₦100,000",
    cta: "Get your professional website today",
  },
  {
    icon: "Smartphone",
    title: "Mobile App Development",
    headline: "Turn your idea into a powerful mobile app",
    desc: "We build fast, scalable, user-friendly mobile apps for Android & iOS that bring your business directly into your customers' hands.",
    features: ["Delivery Apps", "Booking & Service Apps", "Fintech & Wallet Apps", "Custom Business Apps"],
    price: "₦1,000,000",
    cta: "Launch your mobile app and scale faster",
  },
  {
    icon: "Bot",
    title: "AI Automation & Integrations",
    headline: "Automate your business with smart AI systems",
    desc: "We help businesses save time and increase productivity by building AI-powered automation systems that handle tasks for you.",
    features: ["WhatsApp AI Chatbots", "Customer Response Automation", "CRM & Workflow Automation", "AI Business Integrations"],
    price: "₦100,000",
    cta: "Let your business run on autopilot",
  },
];

export const STEPS = [
  { icon: "MessageSquare", n: "01", title: "Tell us what you need", desc: "Share your idea, project, or the problem you want solved. We scope it with you on a quick call." },
  { icon: "PenTool", n: "02", title: "We design & build", desc: "Our team builds your website, app, or AI system — keeping you updated at every stage." },
  { icon: "Rocket", n: "03", title: "Launch & grow", desc: "We deploy, hand over, and support you as your business scales with your new system." },
];

/* Sales AI — our product. Compact mention + link to the web app. */
export const PRODUCT = {
  name: "Sales AI",
  tagline: "Our self-serve product",
  desc: "Sales AI is our WhatsApp AI sales agent that qualifies buyers, answers questions, generates invoices, and closes deals 24/7 — set it up yourself in minutes.",
  cta: "Visit Sales AI",
  features: ["Replies & closes deals 24/7", "Auto-generates invoices", "Sign up & add your business number"],
};

export const COURSE = {
  title: "AI Automation Course",
  headline: "Learn AI automation & build systems that work for you",
  desc: "Master the skills businesses are paying for. Learn how to create powerful AI automation systems that generate leads, close deals, and automate operations.",
  learn: [
    "Foundations of AI Automation",
    "Connecting WhatsApp, Instagram & Facebook",
    "Building Deal-Closing Automation Flows",
    "Auto-Invoicing & Follow-Up Systems",
    "Deploying AI Automation Systems",
    "How to Sell Your AI Solutions to Businesses",
  ],
  who: ["Business Owners", "Freelancers", "Digital Marketers", "Tech Enthusiasts", "Anyone Looking to Earn with AI"],
  price: "₦50,000",
  tagline: "Learn in-demand skills. Build real systems. Create new income opportunities.",
};

/* AI automation setup pricing — UNCHANGED amounts. */
export const PRICING = [
  { name: "Starter Setup", price: "₦150,000", once: "one-time setup",
    tag: "", features: ["1 channel (WhatsApp)", "Auto-replies + FAQ AI", "Invoice generation", "2-week support", "Basic analytics"] },
  { name: "Growth Setup", price: "₦350,000", once: "one-time setup",
    tag: "Most popular", features: ["WhatsApp + Instagram + Facebook", "AI deal-closing flows", "Auto invoicing & follow-ups", "CRM / lead capture", "30-day support & tuning"] },
  { name: "Business Setup", price: "Custom", once: "tailored to you",
    tag: "", features: ["Everything in Growth", "Custom integrations & website", "Multi-agent automations", "Team training", "Priority support"] },
];

export const FAQS = [
  {
    q: "What does JBUIT do?",
    a: "JBUIT is a software development company. We build websites, mobile apps, and AI automation systems for businesses. We also have our own product, Sales AI, and offer an AI Automation Course.",
  },
  {
    q: "How much do your services cost?",
    a: "Web development starts from ₦100,000, mobile apps from ₦1,000,000, and AI automation & integrations from ₦100,000. Final pricing depends on your project's scope — book a call and we'll give you a clear quote.",
  },
  {
    q: "How long does a project take?",
    a: "It depends on scope. A landing page or simple website can be ready in days; a custom mobile app or full automation system takes longer. We give you a timeline upfront and keep you updated throughout.",
  },
  {
    q: "What is Sales AI?",
    a: "Sales AI is our own product — a WhatsApp AI sales agent that replies to customers, qualifies buyers, generates invoices, and closes deals 24/7. It's self-serve: you sign up, add your business phone number, and set it up yourself.",
  },
  {
    q: "Who is the AI Automation Course for?",
    a: "Business owners, freelancers, digital marketers, tech enthusiasts, and anyone looking to earn with AI. It's ₦50,000 for lifetime access and teaches you to build and sell the same systems we build for clients.",
  },
  {
    q: "Do you work with businesses outside Lagos?",
    a: "Yes. We work with clients remotely and deliver web, mobile, and AI projects wherever you are.",
  },
];
