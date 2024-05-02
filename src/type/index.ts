export type Navigation = {
  latitude: number;
  longitude: number;
};
export type Order = {
  end: Navigation;
  orderId: string;
  price: number;
  rider: string;
  start: Navigation;
};
