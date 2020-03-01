type Tornado = {
  id: string;
  coordinates_start: [number, number];
  coordinates_end: [number?, number?];
  date: Date;
  community: string;
  province: string;
  fujita: number;
  length_m?: number;
  motion_deg?: number;
  width_max?: number;
  human_fata?: number;
  human_inj?: number;
  animal_fat?: number;
  animal_inj?: number;
  dmg_thous?: number;
  forecast_r: number;
};

declare module Common {
  type Order = "asc" | "desc";
}
