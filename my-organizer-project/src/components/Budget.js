import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

function BudgetComponent() {
  // Sample data for earnings, expenses, and savings
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Earnings",
        data: [1200, 1000, 1300, 1100, 1400, 1200],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Expenses",
        data: [800, 900, 700, 1000, 850, 950],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Savings",
        data: [400, 100, 600, 100, 550, 250],
        backgroundColor: "rgba(144, 238, 144, 0.5)",
        borderColor: "rgba(144, 238, 144, 1)",
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
    <div className="flex items-center justify-center">
      <div className="w-full p-4">
        <div className="flex">
          <div className="flex-1 mr-4" style={{ height: "300px" }}>
            <h3 className="text-lg font-bold mb-2">Earnings, Expenses, and Savings</h3>
            <canvas ref={barChartRef} style={{ width: "100%" }} />
          </div>

          <div className="flex-1" style={{ height: "300px" }}>
            <h3 className="text-lg font-bold mb-2">Earnings, Expenses, and Savings</h3>
            <canvas ref={pieChartRef} style={{ width: "100%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetComponent;
