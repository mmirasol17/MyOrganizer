import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function BudgetComponent({ user }) {
  const data = {
    labels: ["Expenses", "Earnings", "Savings"],
    datasets: [
      {
        data: [900, 1200, 550],
        backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(75, 192, 192, 0.5)", "rgba(144, 238, 144, 0.5)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)", "rgba(144, 238, 144, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    let pieChartInstance;
    let barChartInstance;
    let firstRender = true; // Flag to check if it's the initial render

    const createCharts = () => {
      // Create the pie chart
      if (pieChartRef.current) {
        pieChartInstance = new Chart(pieChartRef.current, {
          type: "pie",
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: firstRender ? 1000 : 0, // Use animation for the first render, disable it otherwise
            },
          },
        });
      }

      // Create the bar chart
      if (barChartRef.current) {
        barChartInstance = new Chart(barChartRef.current, {
          type: "bar",
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                display: false,
              },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 200,
                },
              },
            },
            animation: {
              duration: firstRender ? 1000 : 0, // Use animation for the first render, disable it otherwise
            },
            plugins: {
              legend: {
                display: false, // Hide the legend
              },
            },
          },
        });
      }

      firstRender = false; // Set the flag to false after the initial render
    };

    const resizeHandler = () => {
      if (pieChartInstance) {
        pieChartInstance.destroy();
      }
      if (barChartInstance) {
        barChartInstance.destroy();
      }
      createCharts();
    };

    createCharts();
    window.addEventListener("resize", resizeHandler);

    return () => {
      if (pieChartInstance) {
        pieChartInstance.destroy();
      }
      if (barChartInstance) {
        barChartInstance.destroy();
      }
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <>
      <div className="bg-green-200 rounded-t-lg w-full text-center p-3 font-bold">My Budget Estimation Summary</div>
      <div className="w-full p-2 text-center overflow-x-auto">
        <div className="flex items-center justify-center">
          <div className="w-full p-4">
            <div className="flex gap-4">
              <div className="flex-1" style={{ height: "200px" }}>
                <canvas ref={pieChartRef} style={{ width: "100%" }} />
              </div>

              <div className="flex-1" style={{ height: "200px" }}>
                <canvas ref={barChartRef} style={{ width: "100%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BudgetComponent;
