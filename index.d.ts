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

type UnitedStatesProperties = {
  om: string;
  yr: string;
  mo: string;
  dy: string;
  date: string;
  time: string;
  tz: string;
  st: string;
  stf: string;
  stn: string;
  mag: string;
  inj: string;
  fat: string;
  loss: string;
  closs: string;
  slat: string;
  slon: string;
  elat: string;
  elon: string;
  len: string;
  wid: string;
  ns: string;
  sn: string;
  sg: string;
  f1: string;
  f2: string;
  f3: string;
  f4: string;
  fc: string;
};

type TornadoId = string;

type RawTornado = {
  id: TornadoId;
  coordinates_start: Common.Coordinates;
  coordinates_end: [number?, number?];
  date: Date;
  fujita: number;
  region_code: string;
};

type TupleTornado = [
  TornadoId,
  Common.Coordinates,
  [number?, number?],
  Date,
  number,
  string
];

type Tornado = RawTornado & {
  geohashStart: string;
  length_m: number;
};

type ClusterStats = {
  coordinates: Common.Coordinates;
  maxFujita: number;
};

type ClusteredTornado = Tornado & {
  cluster: Tornado[];
  clusterStats: ClusterStats;
};

declare module Common {
  type Bounds = [Coordinates, Coordinates];
  type Coordinates = [number, number];
  type ListState = "collapsed" | "expanded";
  type Order = "ascending" | "descending";
  type Status = "idle" | "loading" | "ready" | "error";
  type SortProperty = "date" | "distance" | "fujita" | "region_code";
}
