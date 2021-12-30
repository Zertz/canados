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

type CanadaNTPProperties = {
    X: string;
    Y: string;
    objectid: string;
    globalid: string;
    _date: string;
    Year: string;
    event_name: string;
    classification_status: string;
    rating_status: string;
    event_type: string;
    initial_data_sources: string;
    location_description: string;
    province: string;
    surveys_completed: string;
    damage: string;
    investigation_initiated_by_ntp: string;
    ground_survey_completed_indepen: string;
    event_description: string;
    web_map_link: string;
    CreationDate: string;
    Creator: string;
    EditDate: string;
    Editor: string;
    event_subtype: string;
    damage_summary: string;
    track_length: string;
    max_path_width: string;
    max_wind_speed: string;
    time: string;
    parent_storm_type: string;
    EFDOD: string;
    injuries: string;
    concurrent: string;
    uniqueID: string;
    mean_motion_from: string;
    day: string;
    month: string;
    timeUTC: string;
    timezone: string;
    fatalities_text: string;
    damage_cost_text: string;
}

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
  country_code: string;
  region_code: string;
};

type TupleTornado = [
  TornadoId,
  Common.Coordinates,
  [number?, number?],
  Date,
  number,
  string,
  string
];

type Tornado = RawTornado & {
  length_m: number;
};

type TornadoMatrix = {
  columns: Array<{
    rows: Array<{
      bounds?: L.LatLngBounds;
      density?: number;
      tornados: Map<TornadoId, Tornado>;
    }>;
  }>;
  count: number;
  density: {
    min: number;
    max: number;
  };
};

declare module Common {
  type Bounds = [Coordinates, Coordinates];
  type Coordinates = [number, number];
  type ListState = "collapsed" | "expanded";
  type Order = "ascending" | "descending";
  type Status = "idle" | "loading" | "ready" | "error";
  type SortProperty = "date" | "distance" | "fujita" | "region_code";
}
