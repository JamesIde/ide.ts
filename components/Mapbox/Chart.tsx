import { useState } from "react";
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
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import React from "react";
import { useMarkerStore } from "lib/store/markerStore";

function Chart({ distancePoints, elevationPoints }: { distancePoints: number[]; elevationPoints: number[] }) {
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

  const setMarker = useMarkerStore((state) => state.setMarker);

  const chartData = {
    datasets: [
      {
        label: "Elevation",
        data: elevationPoints,
        fill: true,
        borderColor: "black",
        borderWidth: 1,
        tension: 0.1,
        spanGaps: true,
        yAxisID: "elevation",
        pointRadius: 0,
        pointHoverRadius: 0,
        backgroundColor: "rgb(70,130,180)",
      },
    ],
  } satisfies ChartData;

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
          callback: function (value, index, values) {
            return value / 1000 + " km"; // Format the label with 'km'
          },
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
        title: "",
        callbacks: {
          label: (context: any) => {
            setMarker(context.dataIndex);
            const elevation = context.parsed.y || 0;
            return [`Elevation: ${elevation} m`];
          },
        },
      },
      legend: { display: false },
      colors: {
        enabled: true,
      },
    },
  } satisfies ChartOptions;

  return (
    <div className="w-full mx-auto">
      <Line data={chartData} options={chartOptions} onMouseLeave={() => setMarker(null)} />
    </div>
  );
}
export default React.memo(Chart);
