type CanadaProperties = {
  YYYY_LOCAL: number;
  MM_LOCAL: number;
  DD_LOCAL: number;
  HHMM_LOCAL: number;
  NEAR_CMMTY: string;
  PROVINCE: string;
  FUJITA: number;
  START_LAT_: number;
  START_LON_: number;
  END_LAT_N: number;
  END_LON_W: number;
  LENGTH_M: number;
  MOTION_DEG: number;
  WIDTH_MAX_: number;
  HUMAN_FATA: number;
  HUMAN_INJ: number;
  ANIMAL_FAT: number;
  ANIMAL_INJ: number;
  DMG_THOUS: number;
  FORECAST_R: string;
};

type CanadaEvents = {
  properties: CanadaProperties;
};

type CanadaTracks = {
  geometry: {
    coordinates: Common.Coordinates[];
  };
  properties: CanadaProperties;
};

type TornadoId = string;

type TornadoEvent = {
  id: TornadoId;
  coordinates_start: Common.Coordinates;
  coordinates_end: [number?, number?];
  date: Date;
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
  cluster: TornadoEvent[];
};

type SearchedTornadoEvent = TornadoEvent & {
  relevance: number;
};

declare module Common {
  type Bounds = [Coordinates, Coordinates];
  type Coordinates = [number, number];
  type ListState = "collapsed" | "expanded";
  type Order = "ascending" | "descending";
  type Status = "idle" | "busy" | "done";
  type SortProperty = "date" | "distance" | "fujita" | "location" | "relevance";
}
