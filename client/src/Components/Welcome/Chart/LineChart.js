import React from "react";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

const LineChart = ({ meArray, friendsArray, familyArray, xAxis }) => {
  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white",
        },
      },
      zoom: {
        pan: {
          enabled: true,
        },
        limits: {
          x: { min: 0, max: xAxis.length },
          y: { min: Math.min(...meArray, ...friendsArray, ...familyArray), max: Math.max(...meArray, ...friendsArray, ...familyArray) },
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "xy",
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "#867979",
        },
        ticks: {
          color: "white",
        },
      },
      y: {
        grid: {
          color: "#867979",
        },
        ticks: {
          color: "white",
        },
      },
    },
  };

  const labels = xAxis;
  const data = {
    labels,
    datasets: [
      {
        label: "Me",
        data: meArray,
        backgroundColor: "#2196F3",
        borderColor: "#2196F3",
      },
      {
        label: "Family",
        data: familyArray,
        backgroundColor: "#66e226",
        borderColor: "#66e226",
      },
      {
        label: "Friends",
        data: friendsArray,
        backgroundColor: "#e22661",
        borderColor: "#e22661",
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default LineChart;
