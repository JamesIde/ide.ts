import { useMemo } from "react";
import { Feature, parseGPX } from "@we-gold/gpxjs";
import * as turf from "@turf/turf";
import { LngLatBoundsLike } from "mapbox-gl";
import Map from "./Map";
import Chart from "./Chart";
import { processTrack } from "lib/gpx-mapper/processTrack";

function Mapbox({ line }: { line: string }) {
  const { track, markers, bounds } = useMemo(() => {
    const [file, error] = parseGPX(line);
    if (error) throw error;

    const geojson = file.toGeoJSON();

    const lineString = geojson.features.find(
      (f) => f.geometry.type === "LineString",
    );
    if (!lineString) throw new Error("GPX file contains no track");

    const [minX, minY, maxX, maxY] = turf.bbox(geojson as any);

    return {
      track: processTrack(lineString.geometry.coordinates as number[][]),
      markers: geojson.features.filter(
        (f) => f.geometry.type === "Point",
      ) as Feature[],
      bounds: [minX, minY, maxX, maxY] as LngLatBoundsLike,
    };
  }, [line]);

  return (
    <div className="border border-gray-300 rounded-xl rounded-t-none">
      <Map
        line={line}
        coordinatesArray={track.coordinates}
        markers={markers}
        bounds={bounds}
      />
      <Chart track={track} />
    </div>
  );
}

export default Mapbox;
