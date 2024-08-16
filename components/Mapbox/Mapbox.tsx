import { useEffect, useState } from "react";
import { Feature, parseGPX } from "@we-gold/gpxjs";
import { haversineDistance } from "./Haversine";
import Map from "./Map";
import Chart from "./Chart";
import * as turf from "@turf/turf";

function Mapbox({ line }: { line: string }) {
  useEffect(() => {
    setLoading(true);
    const [file, error] = parseGPX(line);
    if (error) throw error;

    var gps = file.toGeoJSON();

    var lineString = gps.features.find((f) => (f.geometry.coordinates as number[]).length > 0);
    var lineMarkers = gps.features.filter((f) => f.geometry.type === "Point") as Feature[];

    var processedData = parseAndRound(lineString.geometry.coordinates as number[]);

    setDistancePoints(processedData.distancePoints);
    setElevationPoints(processedData.elevationPoints);
    setCoordinatesArray(processedData.coordinateArray);
    setMarkers(lineMarkers);

    setLoading(false);
  }, []);

  const [loading, setLoading] = useState<boolean>(null);

  // Chart
  const [distancePoints, setDistancePoints] = useState<Array<number>>([]);
  const [elevationPoints, setElevationPoints] = useState<Array<number>>([]);

  // Map
  const [coordinatesArray, setCoordinatesArray] = useState<number[][]>([[]]);
  const [markers, setMarkers] = useState<Feature[]>([]);

  return (
    <>
      {!loading && (
        <>
          <Map line={line} coordinatesArray={coordinatesArray} markers={markers} />
          <Chart distancePoints={distancePoints} elevationPoints={elevationPoints} />
        </>
      )}
    </>
  );
}

export const parseAndRound = (gpxCoordinates: Array<number>) => {
  const coordinateAndElevation: Coordinate[] = [];
  const coordinateArray: Array<Array<number>> = [];

  const distancePoints: Array<number> = [];
  const elevationPoints: Array<number> = [];

  let totalDistance = 0;

  for (let i = 0; i < gpxCoordinates.length - 1; i++) {
    var lng = gpxCoordinates[i][0] as unknown as number;
    var lat = gpxCoordinates[i][1] as unknown as number;

    var nextLng = gpxCoordinates[i + 1][0] as unknown as number;
    var nextLat = gpxCoordinates[i + 1][1] as unknown as number;

    var elevation = turf.round(gpxCoordinates[i][2] as unknown as number);
    var distance = haversineDistance({ lat: lat, lng: lng }, { lat: nextLat, lng: nextLng });

    totalDistance += parseInt(distance.toFixed(2));

    distancePoints.push(totalDistance);
    elevationPoints.push(elevation);

    coordinateAndElevation.push({ lng, lat, elevation, distance: totalDistance });
    coordinateArray.push([lng, lat]);
  }

  return { coordinateAndElevation, coordinateArray, distancePoints, elevationPoints };
};

export default Mapbox;

export interface Coordinate {
  lat: number;
  lng: number;
  elevation: number;
  distance: number;
}
