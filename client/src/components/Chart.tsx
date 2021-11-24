import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Header } from "./Header";

interface ChartProps {
  voteData: number[];
}

export const Chart = ({ voteData }: ChartProps) => {
  const chartLabels = ["A", "B", "C", "D", "E"];
  const legend = voteData.map((_, id) => {
    return (
      <div key={id}>
        {chartLabels[id]}:{voteData[id]}
      </div>
    );
  });

  const totalVotes = () => {
    let count = 0;
    for (const [_, value] of Object.entries(voteData)) {
      count += value;
    }
    return count;
  };

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "# of Votes",
        data: voteData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(103,255,86,0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgb(131,255,86)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={"my-4"}>
      <Header text={"Vote Results"} />
      <Doughnut data={chartData} />
      <div className={"text-center m1-3"}>
        Total Votes: {totalVotes()}
        {legend}
      </div>
    </div>
  );
};
