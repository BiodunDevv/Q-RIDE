export const SERVICE_FEE = 10;
export const DRIVER_CODE = "MSAIBR-442";

export type Role = "passenger" | "driver";
export type ToastType = "success" | "error" | "info";

export type Transaction = {
  id: number;
  type: "send" | "receive";
  label: string;
  amount: number;
  rideAmount?: number;
  service?: number;
  method: string;
  time: string;
  driverName?: string;
  receiptId?: string;
  disputed?: boolean;
};

export type CardStatus = "active" | "blocked" | "replacement" | "issuing";

export type UserState = {
  name: string;
  matric: string;
  balance: number;
  tier: number;
  transactions: Transaction[];
  card: string;
  walletFrozen: boolean;
  cardStatus: CardStatus;
};

export type DriverState = {
  name: string;
  code: string;
  balance: number;
  todayEarnings: number;
  transactions: Transaction[];
};

export const INITIAL_USER: UserState = {
  name: "Ademola Rasheed",
  matric: "BU22CSC1005",
  balance: 4850,
  tier: 1,
  transactions: [],
  card: "6037 9975 9598 3090",
  walletFrozen: false,
  cardStatus: "active",
};

export const HERO_CARDS = [
  {
    src: "/card1.svg",
    name: "Transport Wallet",
    status: "Linked",
  },
  {
    src: "/card2.svg",
    name: "Commuter Card",
    status: "Available",
  },
  {
    src: "/card3.svg",
    name: "Campus Shuttle",
    status: "Available",
  },
  {
    src: "/card4.svg",
    name: "Driver Card",
    status: "Operator",
  },
];

export const INITIAL_DRIVER: DriverState = {
  name: "Musa Ibrahim",
  code: DRIVER_CODE,
  balance: 12400,
  todayEarnings: 3200,
  transactions: [],
};

export const formatMoney = (value: number) =>
  `₦${Number(value).toLocaleString("en-NG")}`;

export const getTime = () =>
  new Date().toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const sleep = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms));

export const numericValue = (value: string) => value.replace(/\D/g, "");

export const isDriverCodeValid = (value: string) => {
  const normalized = value.trim().toUpperCase();
  return normalized === DRIVER_CODE || normalized.replace(/\D/g, "") === "442";
};
