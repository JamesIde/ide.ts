import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  Tooltip,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartData,
  ChartOptions,
  Plugin,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useMarkerStore } from "lib/store/markerStore";
import { Track } from "lib/gpx-mapper/processTrack";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Filler);

const ACCENT = "90, 204, 189";

// Vertical crosshair that follows the hovered point
const crosshair: Plugin<"line"> = {
  id: "crosshair",
  afterDatasetsDraw(chart) {
    const active = chart.tooltip?.getActiveElements();
    if (!active?.length) return;
    const { ctx, chartArea } = chart;
    const x = active[0].element.x;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.restore();
  },
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function Chart({ track }: { track: Track }) {
  const setMarker = useMarkerStore((state) => state.setMarker);

  const { data, options } = useMemo(() => {
    const elevations = track.points.map((p) => p.elevation);
    const min = Math.min(...elevations);
    const max = Math.max(...elevations);
    const pad = Math.max(10, (max - min) * 0.1);

    const data: ChartData<"line", { x: number; y: number }[]> = {
      datasets: [
        {
          label: "Elevation",
          data: track.points.map((p) => ({
            x: p.distance / 1000,
            y: p.elevation,
          })),
          borderColor: `rgb(${ACCENT})`,
          borderWidth: 2,
          fill: "start",
          backgroundColor: (ctx) => {
            const { chart } = ctx;
            if (!chart.chartArea) return `rgba(${ACCENT}, 0.3)`;
            const g = chart.ctx.createLinearGradient(
              0,
              chart.chartArea.top,
              0,
              chart.chartArea.bottom,
            );
            g.addColorStop(0, `rgba(${ACCENT}, 0.5)`);
            g.addColorStop(1, `rgba(${ACCENT}, 0.02)`);
            return g;
          },
          tension: 0.2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "white",
          pointHoverBorderColor: `rgb(${ACCENT})`,
          pointHoverBorderWidth: 2,
        },
      ],
    };

    const options: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      parsing: false,
      interaction: { mode: "nearest", axis: "x", intersect: false },
      onHover: (_event, elements) =>
        setMarker(elements.length ? elements[0].index : null),
      scales: {
        x: {
          type: "linear",
          min: 0,
          max: track.totalDistance / 1000,
          grid: { display: false },
          border: { display: false },
          ticks: {
            maxTicksLimit: 8,
            color: "#6b7280",
            callback: (v) => `${Number(v).toFixed(0)} km`,
          },
        },
        y: {
          min: Math.floor((min - pad) / 10) * 10,
          max: Math.ceil((max + pad) / 10) * 10,
          grid: { color: "rgba(0,0,0,0.06)" },
          border: { display: false },
          ticks: {
            maxTicksLimit: 5,
            color: "#6b7280",
            callback: (v) => `${v} m`,
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          backgroundColor: "white",
          titleColor: "#111827",
          bodyColor: "#0f766e",
          borderColor: "#e5e7eb",
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          titleFont: { size: 13, weight: "bold" },
          bodyFont: { size: 13 },
          callbacks: {
            title: (items) => `${(items[0].parsed.x as number).toFixed(2)} km`,
            label: (item) => `Elevation: ${item.parsed.y} m`,
          },
        },
      },
    };

    return { data, options };
  }, [track, setMarker]);

  return (
    <div>
      <div className="flex gap-6 pr-4 pl-3 pt-3">
        <Stat
          label="Distance"
          value={`${(track.totalDistance / 1000).toFixed(1)} km`}
        />
        <Stat label="Ascent" value={`${track.gain} m`} />
        <Stat label="Descent" value={`${track.loss} m`} />
      </div>
      <div className="h-[250px] p-2">
        <Line
          data={data}
          options={options}
          plugins={[crosshair]}
          onMouseLeave={() => setMarker(null)}
        />
      </div>
    </div>
  );
}

export default React.memo(Chart);
