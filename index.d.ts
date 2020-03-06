type TornadoId = string;

type TornadoCoordinates = [number, number];

type TornadoEvent = {
  id: TornadoId;
  coordinates_start: TornadoCoordinates;
  coordinates_end: [number?, number?];
  date: ?Date;
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
  tracks: TornadoCoordinates[];
};

declare module Common {
  type Order = "asc" | "desc";
  type SortProperty = "date" | "fujita" | "location"
}
