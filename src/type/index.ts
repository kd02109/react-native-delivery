export type Navigation = {
  latitude: number;
  longitude: number;
};
export type Order = {
  end: Navigation;
  start: Navigation;
  orderId: string;
  price: number;
  rider?: string;
  image?: string;
  completedAt?: string;
};
