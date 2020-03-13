type TornadoId = string;

type TornadoEvent = {
  id: TornadoId;
  coordinates_start: Common.Coordinates;
  coordinates_end: [number?, number?];
  date?: Date;
  community: string;
  province: string;
  fujita: number;
  geohash: string;
  length_m?: number;
  motion_deg?: number;
  width_max?: number;
  human_fata?: number;
  human_inj?: number;
  animal_fat?: number;
  animal_inj?: number;
  dmg_thous?: number;
  forecast_r: number;
  tracks: Common.Coordinates[];
};

type ClusteredTornadoEvent = TornadoEvent & {
  cluster: number;
};

declare module Common {
  type Bounds = [Coordinates, Coordinates];
  type Coordinates = [number, number];
  type Order = "asc" | "desc";
  type SortProperty = "date" | "distance" | "fujita" | "location";
}
