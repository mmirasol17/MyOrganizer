import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function BudgetComponent({ user }) {
  // Sample data for expenses, earnings, and savings
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

  // Create references for the chart canvases
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    let pieChartInstance;
    let barChartInstance;

    const resizeHandler = () => {
      if (pieChartInstance) {
        pieChartInstance.resize();
      }
      if (barChartInstance) {
        barChartInstance.resize();
      }
    };

    // Create the pie chart
    if (pieChartRef.current) {
      pieChartInstance = new Chart(pieChartRef.current, {
        type: "pie",
        data: data,
        options: {
          responsive: true,

          maintainAspectRatio: false,
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
        },
      });
    }

    window.addEventListener("resize", resizeHandler);

    // Cleanup function to destroy chart instances and remove event listener
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
      <div className="bg-green-200 rounded-t-lg w-full text-center p-3 font-bold">My Budget Summary</div>
      <div className="w-full p-2 text-center">
        <div className="flex items-center justify-center">
          <div className="w-full p-4">
            <div className="flex">
              <div className="flex-1 mr-4" style={{ height: "300px" }}>
                <canvas ref={barChartRef} style={{ width: "100%" }} />
              </div>

              <div className="flex-1" style={{ height: "300px" }}>
                <canvas ref={pieChartRef} style={{ width: "100%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BudgetComponent;
