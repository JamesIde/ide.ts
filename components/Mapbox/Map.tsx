import mapboxGL, { LngLatBoundsLike, LngLatLike, Map as MapboxGL, Marker } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import React, { MutableRefObject, Ref, useEffect, useRef, useState } from "react";
import { Feature, parseGPX } from "@we-gold/gpxjs";
import * as turf from "@turf/turf";
import { Coordinate } from "./Mapbox";
import { useMarkerStore } from "lib/store/markerStore";
import mapboxgl from "mapbox-gl";

function Map({ line, coordinatesArray, markers }: { line: string; coordinatesArray: number[][]; markers: Feature[] }) {
  mapboxGL.accessToken = "pk.eyJ1IjoiMW1hY3JvcyIsImEiOiJjbGYzZndjb3QwZzZzM3NwZnNheGhpcGEyIn0.1kFMlajw3UonchFxVMZ-8A";
  const mapContainer = useRef(null);
  const map = useRef<MapboxGL | null>(null);
  const marker = useRef<Marker | null>(null);

  const markerIdx = useMarkerStore((state) => state.marker);

  // Load the map
  useEffect(() => {
    const [file, error] = parseGPX(line);
    if (error) throw error;

    var gps = file.toGeoJSON();

    var bbox = turf.bbox(gps as any);
    var bounds: LngLatBoundsLike = [bbox[0], bbox[1], bbox[2], bbox[3]];

    map.current = new MapboxGL({
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
      PlotLine(map, coordinatesArray);
      PlotStartEndCoordinates(map, coordinatesArray[0], coordinatesArray[coordinatesArray.length - 1]);
      PlotMarkers(map, markers);
    });

    return () => map.current?.remove();
  }, [line, coordinatesArray, markers]);

  useEffect(() => {
    if (marker.current) {
      marker.current?.remove();
    }

    if (markerIdx) {
      const coords = coordinatesArray[markerIdx];
      marker.current = new mapboxgl.Marker().setLngLat(coords as LngLatLike).addTo(map.current!);
    }
  }, [marker, markerIdx]);

  return (
    <div id="map" className="">
      <div ref={mapContainer} className="h-[550px] w-full object-fill"></div>
    </div>
  );
}
export default React.memo(Map);

export const PlotMarkers = (map: MutableRefObject<MapboxGL>, markers: Feature[]) => {
  for (const marker of markers) {
    const popup = new mapboxGL.Popup().setText(`${marker.properties["name"]}`);

    const el = document.createElement("div");
    el.className = "marker";

    var coords = [marker.geometry.coordinates[0], marker.geometry.coordinates[1]] as any;
    new mapboxGL.Marker(el).setLngLat(coords).setPopup(popup).addTo(map.current);
  }
};

export const PlotLine = (map: MutableRefObject<MapboxGL>, coordinates: number[][]) => {
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

export const PlotStartEndCoordinates = (map: MutableRefObject<MapboxGL>, start: number[], end: number[]) => {
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
      "circle-stroke-color": "rgba(255, 255, 255, 1)",
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
      "circle-stroke-color": "rgba(255, 255, 255, 1)",
    },
  });
};
