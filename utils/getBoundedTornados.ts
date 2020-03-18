export function getBoundedTornados({
  bounds,
  tornados
}: {
  bounds: Common.Bounds;
  tornados: TornadoEvent[];
}) {
  return tornados.filter(({ coordinates_end, coordinates_start, tracks }) => {
    const [southWestBounds, northEastBounds] = bounds;

    if (
      coordinates_start[0] > southWestBounds[0] &&
      coordinates_start[0] < northEastBounds[0] &&
      coordinates_start[1] > southWestBounds[1] &&
      coordinates_start[1] < northEastBounds[1]
    ) {
      return true;
    }

    if (
      coordinates_end[0] &&
      coordinates_end[0] > southWestBounds[0] &&
      coordinates_end[0] < northEastBounds[0] &&
      coordinates_end[1] &&
      coordinates_end[1] > southWestBounds[1] &&
      coordinates_end[1] < northEastBounds[1]
    ) {
      return true;
    }

    if (!Array.isArray(tracks)) {
      return false;
    }

    return tracks.some(
      coordinates =>
        coordinates[0] > southWestBounds[0] &&
        coordinates[0] < northEastBounds[0] &&
        coordinates[1] > southWestBounds[1] &&
        coordinates[1] < northEastBounds[1]
    );
  });
}
