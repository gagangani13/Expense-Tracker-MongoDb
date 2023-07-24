import React from "react";
import { Pie } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, zoomPlugin);

const labels = ["Me", "Family", "Friends"];

const PieChart = ({ meArray, familyArray, friendsArray, xAxis }) => {
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
  };

  const dataset = [];
  for (let i = 0; i < xAxis.length; i++) {
    dataset.unshift({
      label: xAxis[i],
      data: [meArray[i], familyArray[i], friendsArray[i]],
      borderColor: "#00000080",
      backgroundColor: ["#2196F3", "#66e226", "#e22661"],
      borderWidth: 5,
    });
  }

  const data = {
    labels,
    datasets: dataset,
  };

  return (
    <div style={{ width: "50%", display: "flex", justifyContent: "center" }}>
      <Pie options={options} data={data} />
    </div>
  );
};

export default PieChart;
