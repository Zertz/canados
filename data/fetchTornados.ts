import got from "got";
import { formatCanadaData } from "../utils/canada/formatCanadaData";
import { formatNorthernTornadoesProjectData } from "../utils/canada/formatNorthernTornadoesProjectData";
import { formatUnitedStatesData } from "../utils/united-states/formatUnitedStatesData";

const countries = ["CA", "CA-NTP", "US"] as const;

type Country = typeof countries[number];

export async function fetchTornados(country: Country) {
  switch (country) {
    case "CA": {
      const [{ features: rawEvents }, { features: rawTracks }] =
        await Promise.all([
          got(
            "http://donnees.ec.gc.ca/data/weather/products/canadian-national-tornado-database-verified-events-1980-2009-public/canadian-national-tornado-database-verified-events-1980-2009-public-gis-en/GIS_CAN_VerifiedTornadoes_1980-2009.json"
          ).json<{
            features: Array<CanadaEvents>;
          }>(),
          got(
            "http://donnees.ec.gc.ca/data/weather/products/canadian-national-tornado-database-verified-events-1980-2009-public/canadian-national-tornado-database-verified-tracks-1980-2009-public-gis-en/GIS_CAN_VerifiedTracks_1980-2009.json"
          ).json<{
            features: Array<CanadaTracks>;
          }>(),
        ]);

      return formatCanadaData(rawEvents, rawTracks);
    }
    case "CA-NTP": {
      return formatNorthernTornadoesProjectData();
    }
    case "US": {
      return formatUnitedStatesData();
    }
  }
}
