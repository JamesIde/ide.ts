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
  Plugin,
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
        backgroundColor: "rgb(151,211,203, 0.7)",
      },
    ],
  } satisfies ChartData;

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        labels: distancePoints as any,
        title: {
          display: true,
          text: "Distance (km)",
        },
        ticks: {
          callback: function (value, index, values) {
            return value / 1000 + " km";
          },
        },
        type: "linear",
        position: "bottom",
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        displayColors: false,
        titleColor: "black",
        bodyColor: "rgb(90, 204, 189)",
        borderWidth: 1,
        borderColor: "gray",
        titleFont: { size: 14 },
        bodyFont: { size: 14, weight: "bolder" },
        padding: 12,
        cornerRadius: 0,
        backgroundColor: "white",
        callbacks: {
          label: (context: any) => {
            setMarker(context.dataIndex);
            const elevation = context.parsed.y || 0;
            return [`Elevation: ${elevation} m`];
          },
          title(tooltipItems) {
            const number = parseInt(tooltipItems[0].label.replace(",", ""), 10);
            const distance = Math.round((number / 1000) * 10) / 10;
            return [`Distance: ${distance} km`];
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  } as ChartOptions;

  return (
    <div className="mt-3 mb-1 mx-2">
      <div className="w-full mx-auto h-[250px] p-2 border-[1px] border-gray-300 rounded-xl">
        <Line data={chartData} options={chartOptions as any} onMouseLeave={() => setMarker(null)} />
      </div>
    </div>
  );
}
export default React.memo(Chart);
