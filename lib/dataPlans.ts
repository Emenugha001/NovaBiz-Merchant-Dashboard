export interface DataPlan {
  id: string;
  label: string;
  validity: string;
  priceKobo: number;
}

export const DATA_PLANS: DataPlan[] = [
  { id: "500mb-1d", label: "500MB", validity: "1 day", priceKobo: 30000 },
  { id: "1gb-1d", label: "1GB", validity: "1 day", priceKobo: 50000 },
  { id: "1.5gb-7d", label: "1.5GB", validity: "7 days", priceKobo: 100000 },
  { id: "2gb-30d", label: "2GB", validity: "30 days", priceKobo: 150000 },
  { id: "5gb-30d", label: "5GB", validity: "30 days", priceKobo: 250000 },
  { id: "10gb-30d", label: "10GB", validity: "30 days", priceKobo: 400000 },
];
