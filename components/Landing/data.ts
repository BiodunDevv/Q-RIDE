import {
  BadgeCheck,
  Bus,
  CreditCard,
  MapPinned,
  ShieldCheck,
  Smartphone,
  Users,
  WalletCards,
  WifiOff,
  Zap,
} from "lucide-react";

export const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#solution", label: "Solution" },
  { href: "/prototype", label: "Prototype" },
  { href: "#waitlist", label: "Waitlist" },
];

export const steps = [
  {
    title: "Create an account",
    description:
      "Commuters register on QRide and receive a wallet connected to their NFC-enabled card.",
    icon: Smartphone,
  },
  {
    title: "Fund the wallet",
    description:
      "Users load transport money once, then ride without hunting for cash, exact change, or working bank apps.",
    icon: WalletCards,
  },
  {
    title: "Tap to pay",
    description:
      "The card is tapped on the driver device and the fare is deducted instantly, even when network service is poor.",
    icon: CreditCard,
  },
];

export const problems = [
  "Banking apps fail or delay during trips",
  "Cash is not always available in exact amounts",
  "Shared rides create fare-splitting confusion",
  "Manual payments slow drivers and passengers down",
];

export const flows = [
  "app signup -> verified QRide wallet",
  "QRide wallet -> NFC card issued",
  "wallet funding -> stored transport balance",
  "driver device -> card tap received",
  "fare rule -> instant deduction",
  "trip record -> driver credited",
];

export const marketCards = [
  {
    title: "Students",
    meta: "Campus shuttles, taxis, and motorcycles",
    icon: Users,
  },
  {
    title: "Daily commuters",
    meta: "Urban riders moving through Ibadan, Lagos, Abuja, and beyond",
    icon: MapPinned,
  },
  {
    title: "Drivers",
    meta: "Bus, taxi, motorcycle, and informal transport operators",
    icon: Bus,
  },
  {
    title: "Institutions",
    meta: "Universities, transport unions, and private operators",
    icon: BadgeCheck,
  },
];

export const operations = [
  ["For users", "Register, fund wallet, collect card, and tap to pay."],
  ["For drivers", "Install QRide, accept NFC taps, and receive fare value."],
  ["System management", "Track trips, secure records, support card replacement."],
  ["Technology", "Encrypted NFC payments designed for offline reliability."],
];

export const revenueModel = [
  ["Transaction fees", "A small charge per completed ride payment."],
  ["Card issuance", "One-time payment for NFC card access."],
  ["Partnerships", "Transport unions, universities, and operators."],
];

export const strategies = [
  {
    title: "Awareness",
    items: "Social campaigns, campus activation, and street demonstrations.",
  },
  {
    title: "Adoption",
    items: "First-ride discounts, driver incentives, and referral rewards.",
  },
  {
    title: "Trust",
    items: "Live tap-to-pay demos, responsive support, and transport partnerships.",
  },
  {
    title: "Growth",
    items: "Start with universities, expand to hubs, then scale city by city.",
  },
];

export const metrics = [
  { title: "Registered users", meta: "User growth" },
  { title: "Active riders", meta: "Daily and weekly usage" },
  { title: "Cards issued", meta: "NFC distribution" },
  { title: "Daily transactions", meta: "Ride payment volume" },
  { title: "Drivers onboarded", meta: "Operator adoption" },
  { title: "Revenue generated", meta: "Fees and partnerships" },
  { title: "Campuses live", meta: "Institution expansion" },
  { title: "Cities reached", meta: "Market spread" },
];

export const challengeRows = [
  ["Card loss", "Block and replace cards through QRide support."],
  ["Driver adoption", "Use training, onboarding, and early-driver incentives."],
  ["Security concerns", "Protect transactions with encrypted NFC communication."],
  ["Public awareness", "Run campus, park, and social media demonstrations."],
];

export const marqueeItems = [
  "offline NFC payments",
  "instant fare deduction",
  "campus ready",
  "shared ride splitting",
  "driver payouts",
  "cashless commuting",
];

export const footerGroups = [
  ["Product", "NFC card", "QRide wallet", "Fare splitting"],
  ["Users", "Students", "Drivers", "Daily commuters"],
  ["Growth", "Campus launch", "Transport unions", "City expansion"],
];

export const heroIcons = {
  creditCard: CreditCard,
  shield: ShieldCheck,
  wifiOff: WifiOff,
  zap: Zap,
};
