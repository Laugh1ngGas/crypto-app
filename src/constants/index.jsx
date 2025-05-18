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
    text: "The perfect exchange for beginners. Clean UI and easy to start trading.",
  },
  {
    user: "Jane Smith",
    company: "Blue Horizon Technologies",
    image: user2,
    text: "Execution speed is top-notch. I place an order, and it’s filled instantly.",
  },
  {
    user: "David Johnson",
    company: "Quantum Innovations",
    image: user3,
    text: "Would love to see more UAH trading pairs, but overall it’s excellent. Support is quick.",
  },
  {
    user: "Ronee Brown",
    company: "Fusion Dynamics",
    image: user4,
    text: "The mobile app is super handy. I can trade from anywhere without limitations.",
  },
  {
    user: "Michael Wilson",
    company: "Visionary Creations",
    image: user5,
    text: "I had doubts at first, but after the first withdrawal I was impressed. Fast and transparent.",
  },
  {
    user: "Emily Davis",
    company: "Synergy Systems",
    image: user6,
    text: "Lower fees than Binance! And they support UAH — huge advantage.",
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
