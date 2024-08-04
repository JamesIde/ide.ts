import mapboxGL, { LngLatBoundsLike, Map } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { MutableRefObject, Ref, useEffect, useRef, useState } from "react";
import { Feature, parseGPX } from "@we-gold/gpxjs";
import * as turf from "@turf/turf";
import { yosemite } from "./Yosemite";
import { haversineDistance } from "./Haversine";

import {
  Chart as ChartJS,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

function Mapbox() {
  mapboxGL.accessToken = "pk.eyJ1IjoiMW1hY3JvcyIsImEiOiJjbGYzZndjb3QwZzZzM3NwZnNheGhpcGEyIn0.1kFMlajw3UonchFxVMZ-8A";
  const mapContainer = useRef(null);
  const map = useRef<Map | null>(null);

  const [distancePoints, setDistancePoints] = useState<Array<number>>([]);
  const [elevationPoints, setElevationPoints] = useState<Array<number>>([]);

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  useEffect(() => {
    const [file, error] = parseGPX(yosemite);
    if (error) throw error;

    var gps = file.toGeoJSON();

    var lineString = gps.features.find((f) => (f.geometry.coordinates as number[]).length > 0);
    var lineMarkers = gps.features.filter((f) => f.geometry.type === "Point") as Feature[];

    var bbox = turf.bbox(gps as any);
    var bounds: LngLatBoundsLike = [bbox[0], bbox[1], bbox[2], bbox[3]];

    var processedData = parseAndRound(lineString.geometry.coordinates as number[]);

    setDistancePoints(processedData.distancePoints);
    setElevationPoints(processedData.elevationPoints);

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
      PlotLine(map, processedData.coordinateArray);
      PlotStartEndCoordinates(
        map,
        processedData.coordinateArray[0],
        processedData.coordinateArray[processedData.coordinateArray.length - 1]
      );
      PlotMarkers(map, lineMarkers);
    });

    return () => map.current?.remove();
  }, []);
  console.log(distancePoints);
  const chartData: ChartData = {
    datasets: [
      {
        label: "Elevation",
        data: elevationPoints,
        // borderColor: "rgba(75, 192, 192, 1)",
        // backgroundColor: "rgba(75, 192, 192, 0.2)", // Fill color with transparency
        // borderWidth: 1,
        // fill: true,
        yAxisID: "elevation",
      },
    ],
  };

  const chartOptions = {
    // maintainAspectRatio: false, // Disable the aspect ratio to control the height

    scales: {
      x: {
        display: true,
        labels: distancePoints,
        title: {
          display: true,
          text: "Distance (km)", // X-axis title
        },
        ticks: {
          // stepSize: 5, // Set the step size to 10 km
          // callback: function (value, index, values) {
          //   return value / 1000 + " km"; // Format the label with 'km'
          // },
        },
        type: "linear",
        position: "bottom",
      },
    },
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        displayColors: false,
        title: () => "",
        callbacks: {
          label: (context: any) => {
            console.log(context);
            const elevation = context.parsed.y || 0;
            return [`Elevation: ${elevation} m`, `${(context.label / 1000).toFixed(2)}km`];
          },
        },
      },
      background: {
        color: "rgba(173, 216, 230, 0.2)", // Light blue background color for the chart
      },
      legend: { display: false },
    },
  } satisfies ChartOptions;

  return (
    <div id="map" className=" mx-auto xl:w-[40%] lg:w-[80%] md:w-[70%] mt-5 mb-5">
      <div ref={mapContainer} className="h-[550px] w-full object-fill"></div>
      <div style={{ width: "100%", height: "400px" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
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

export const PlotMarkers = (map: MutableRefObject<Map>, markers: Feature[]) => {
  for (const marker of markers) {
    const popup = new mapboxGL.Popup({ offset: 25 }).setText(`${marker.properties["name"]}`);
    var coords = [marker.geometry.coordinates[0], marker.geometry.coordinates[1]] as any;
    new mapboxGL.Marker().setLngLat(coords).setPopup(popup).addTo(map.current);
  }
};

export const PlotLine = (map: MutableRefObject<Map>, coordinates: number[][]) => {
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

interface Coordinate {
  lat: number;
  lng: number;
  elevation: number;
  distance: number;
}

export default Mapbox;
