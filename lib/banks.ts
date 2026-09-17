export interface Bank {
  id: string;
  name: string;
  logoUrl: string;
}

export const RECENT_BANK_IDS = ["moniepoint", "opay", "zenith-bank", "uba"];

export const BANKS: Bank[] = [
  {
    id: "fcmb",
    name: "First City Monument Bank",
    logoUrl: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789631826/fcmb_hp206x.jpg",
  },
  {
    id: "fidelity-bank",
    name: "Fidelity Bank",
    logoUrl: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789631841/fidelity_s8bhnu.png",
  },
  {
    id: "first-bank",
    name: "First Bank of Nigeria",
    logoUrl: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1773313620/download2_unrzbi.jpg",
  },
  {
    id: "gtbank",
    name: "Guaranty Trust Bank",
    logoUrl: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789631797/gt_qppqdi.jpg",
  },
  {
    id: "moniepoint",
    name: "Moniepoint MFB",
    logoUrl: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789631802/monie_tdxjmg.jpg",
  },
  {
    id: "opay",
    name: "OPay",
    logoUrl: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789631819/opay_tbnagy.jpg",
  },
  {
    id: "providus-bank",
    name: "Providus Bank",
    logoUrl: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789631833/provid_gesq3p.png",
  },
  {
    id: "stanbic-ibtc",
    name: "Stanbic IBTC Bank",
    logoUrl: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789631849/Stanbic_ma9wr3.png",
  },
  {
    id: "uba",
    name: "United Bank for Africa",
    logoUrl: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789632333/uba_dfkqh4.jpg",
  },
  {
    id: "zenith-bank",
    name: "Zenith Bank",
    logoUrl: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789631858/Zenith_Bank_logo_q6xab5.webp",
  },
];
