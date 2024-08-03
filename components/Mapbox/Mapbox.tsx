import mapboxGL, { LngLatBoundsLike, LngLatLike, Map } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { MutableRefObject, Ref, useEffect, useRef } from "react";
import { parseGPX } from "@we-gold/gpxjs";
import * as turf from "@turf/turf";
import { yosemite } from "./Yosemite";
function Mapbox() {
  mapboxGL.accessToken = "pk.eyJ1IjoiMW1hY3JvcyIsImEiOiJjbGYzZndjb3QwZzZzM3NwZnNheGhpcGEyIn0.1kFMlajw3UonchFxVMZ-8A";
  const mapContainer = useRef(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    const [file, error] = parseGPX(yosemite);
    if (error) throw error;

    var gps = file.toGeoJSON();

    console.log(gps);

    var lineString = gps.features.find((f) => (f.geometry.coordinates as number[]).length > 0);

    var bbox = turf.bbox(gps as any);

    var bounds: LngLatBoundsLike = [bbox[0], bbox[1], bbox[2], bbox[3]];

    var processedData = parseAndRound(lineString.geometry.coordinates as number[]);

    map.current = new Map({
      container: mapContainer.current!,
      style: "mapbox://styles/1macros/clzdtvgw800fs01r142d8d8lr",
      bounds: bounds,
      zoom: 6,
      fitBoundsOptions: {
        padding: 15,
      },
    });

    map.current.addControl(new mapboxGL.NavigationControl());
    map.current.addControl(new mapboxGL.FullscreenControl());

    map.current.on("load", () => {
      PlotTrackOnMap(map, processedData.coordinateArray);
      PlotStartEndCoordinates(
        map,
        processedData.coordinateArray[0],
        processedData.coordinateArray[processedData.coordinateArray.length - 1]
      );
    });
    // set max bounds to be like a 1000 padding
    return () => map.current?.remove();
  }, []);

  return (
    <div id="map" className=" mx-auto xl:w-[40%] lg:w-[70%] md:w-[70%] mt-5 mb-5">
      <div ref={mapContainer} className="h-[550px] w-full object-fill"></div>
    </div>
  );
}

export const parseAndRound = (gpxCoordinates: Array<number>) => {
  const coordinateAndElevation: Coordinate[] = [];
  const coordinateArray: Array<Array<number>> = [];

  for (let i = 0; i < gpxCoordinates.length; i++) {
    var lng = gpxCoordinates[i][0] as unknown as number;
    var lat = gpxCoordinates[i][1] as unknown as number;
    var elevation = turf.round(gpxCoordinates[i][2] as unknown as number);
    coordinateAndElevation.push({ lng, lat, elevation });
    coordinateArray.push([lng, lat]);
  }

  return { coordinateAndElevation, coordinateArray };
};

export const PlotTrackOnMap = (map: MutableRefObject<Map>, coordinates: number[][]) => {
  map.current?.addSource("gps", {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coordinates,
      },
      properties: {
        description: "Activity",
      },
    },
  });
  // Add the line layer on top of the geojson source
  map.current?.addLayer({
    id: "gps",
    type: "line",
    source: "gps",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "red",
      "line-width": 3,
    },
  });
};

export const PlotStartEndCoordinates = (map: MutableRefObject<Map>, start: number[], end: number[]) => {
  map.current?.addSource("start", {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: start,
      },
      properties: {
        description: "Start Circle of a gps track",
      },
    },
  });

  map.current?.addLayer({
    id: "start",
    type: "circle",
    source: "start",
    layout: {
      visibility: "visible",
    },
    paint: {
      "circle-radius": 8,
      "circle-color": "#7AA53B",
      "circle-stroke-width": 2,
      "circle-stroke-color": "rgba(255, 255, 255, 1)", // White color
    },
  });

  map.current?.addSource("end", {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: end,
      },
      properties: {
        description: "End Circle of a gps track",
      },
    },
  });

  map.current?.addLayer({
    id: "end",
    type: "circle",
    source: "end",
    layout: {
      visibility: "visible",
    },
    paint: {
      "circle-radius": 8,
      "circle-color": "#B81818",
      "circle-stroke-width": 2,
      "circle-stroke-color": "rgba(255, 255, 255, 1)", // White color
    },
  });
};

interface Coordinate {
  lat: number;
  lng: number;
  elevation: number;
}

export default Mapbox;
