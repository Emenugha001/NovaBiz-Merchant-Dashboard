export interface Network {
  id: string;
  name: string;
  logoUrl: string;
}

export const NETWORKS: Network[] = [
  {
    id: "mtn",
    name: "MTN",
    logoUrl: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789632189/mtn_u5ibhn.png",
  },
  {
    id: "airtel",
    name: "Airtel",
    logoUrl: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1773313380/image_4_zuxenn.png",
  },
  {
    id: "glo",
    name: "Glo",
    logoUrl: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789632196/glo_vwm92t.jpg",
  },
  {
    id: "9mobile",
    name: "9mobile",
    logoUrl: "https://res.cloudinary.com/dbmsazt7b/image/upload/v1789632202/9mobile_n6i3gl.jpg",
  },
];
