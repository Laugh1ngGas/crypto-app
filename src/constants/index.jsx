import { Lock, Zap, CircleDollarSign, MonitorSmartphone, Globe, Headset, Blocks } from "lucide-react";

import user1 from "../assets/profile-pictures/user1.jpg";
import user2 from "../assets/profile-pictures/user2.jpg";
import user3 from "../assets/profile-pictures/user3.jpg";
import user4 from "../assets/profile-pictures/user4.jpg";
import user5 from "../assets/profile-pictures/user5.jpg";
import user6 from "../assets/profile-pictures/user6.jpg";

export const navItems = [
  { label: "Buy Crypto", href: "#" },
  { label: "Markets", href: "#" },
  {
    label: "Trade",
    submenu: [
      { label: "Spot", href: "#" },
      { label: "Margin", href: "#" },
      { label: "P2P", href: "#" },
      { label: "Swap", href: "#" },
    ],
  },
  {
    label: "More",
    submenu: [
      { label: "Academy", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
];

export const testimonials = [
  {
    user: "John Doe",
    company: "Stellar Solutions",
    image: user1,
    text: "Finally, an app that shows real-time crypto prices without all the clutter. Clean and simple!",
  },
  {
    user: "Jane Smith",
    company: "Blue Horizon Technologies",
    image: user2,
    text: "I love how I can connect my wallet and instantly see my balance in the currency I choose. Makes tracking so much easier.",
  },
  {
    user: "David Johnson",
    company: "Quantum Innovations",
    image: user3,
    text: "The interface is super user-friendly — perfect for daily price tracking and quick market overviews.",
  },
  {
    user: "Ronee Brown",
    company: "Fusion Dynamics",
    image: user4,
    text: "Login with Google and email verification adds a nice layer of security. I feel safe using it.",
  },
  {
    user: "Michael Wilson",
    company: "Visionary Creations",
    image: user5,
    text: "I use this app to analyze when to buy or sell. The charts and market data are really helpful.",
  },
  {
    user: "Emily Davis",
    company: "Synergy Systems",
    image: user6,
    text: "Support for multiple currencies is a great feature! I live in Europe, so seeing everything in euros is very convenient.",
  },
];

export const features = [
  {
    icon: <Lock />,
    text: "Bank-Level Security",
    description:
      "95% of funds stored in cold wallets. 2FA, encryption, and regular audits ensure protection.",
  },
  {
    icon: <Zap />,
    text: "Ultra-Fast Trading Engine",
    description:
      "Orders are executed in milliseconds — with real-time price updates and minimal latency.",
  },
  {
    icon: <CircleDollarSign />,
    text: "Transparent & Low Fees",
    description:
      "Flat fee structure with no hidden charges. The more you trade — the lower your fees.",
  },
  {
    icon: <MonitorSmartphone />,
    text: "Powerful Mobile App",
    description:
      "Full-featured exchange on your phone. Available for iOS and Android.",
  },
  {
    icon: <Globe />,
    text: "Multi-Currency Support",
    description:
      "Deposit and withdraw in UAH, USD, EUR. Visa and MasterCard accepted.",
  },
  {
    icon: <Headset />,
    text: "Dedicated Support Team",
    description:
      "24/7 customer support with fast response via live chat, email, and Telegram.",
  },
  // {
  //   icon: <Blocks />,
  //   text: "Browser Extension",
  //   description:
  //     "Trade directly from your browser! Access portfolio, charts, and alerts via Chrome or Firefox plugin.",
  // },
];

export const checklistItems = [
  {
    title: "Code merge made easy",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "Review code without worry",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "AI Assistance to reduce time",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "Share work in minutes",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
];

export const pricingOptions = [
  {
    title: "Free",
    price: "$0",
    features: [
      "Private board sharing",
      "5 Gb Storage",
      "Web Analytics",
      "Private Mode",
    ],
  },
  {
    title: "Pro",
    price: "$10",
    features: [
      "Private board sharing",
      "10 Gb Storage",
      "Web Analytics (Advance)",
      "Private Mode",
    ],
  },
  {
    title: "Enterprise",
    price: "$200",
    features: [
      "Private board sharing",
      "Unlimited Storage",
      "High Performance Network",
      "Private Mode",
    ],
  },
];

export const communityLinks = [
  { href: "#", text: "" },
  { href: "#", text: "" },
  { href: "#", text: "" },
  { href: "#", text: "" },
  { href: "#", text: "" },
];

export const aboutUsLinks = [
  { href: "#", text: "About" },
  { href: "#", text: "Announcements" },
  { href: "#", text: "Blog" },
  { href: "#", text: "Community" },
  { href: "#", text: "Downloads" },
];

export const supportLinks = [
  { href: "#", text: "Chat Support" },
  { href: "#", text: "Support Center" },
  { href: "#", text: "Product Feedback & Suggestions" },
];
