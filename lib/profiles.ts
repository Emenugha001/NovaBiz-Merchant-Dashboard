export interface Profile {
  id: string;
  name: string;
  accountNumber: string;
  balanceKobo: number;
  email: string;
  password: string;
}

export const PROFILES: Profile[] = [
  {
    id: "adamu-ade",
    name: "Adamu Ade",
    accountNumber: "8112345671",
    balanceKobo: 50000000,
    email: "adamu.ade@novabiz.test",
    password: "adamu1234",
  },
  {
    id: "sanwo-olu",
    name: "Sanwo Olu",
    accountNumber: "8112345682",
    balanceKobo: 150000000,
    email: "sanwo.olu@novabiz.test",
    password: "sanwo1234",
  },
  {
    id: "jah-jesu",
    name: "Jah Jesu",
    accountNumber: "8118472163",
    balanceKobo: 12876182,
    email: "jah.jesu@novabiz.test",
    password: "jahjesu1234",
  },
];
