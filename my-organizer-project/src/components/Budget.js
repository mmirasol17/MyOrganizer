import React from "react";
import { Chart } from "chart.js/auto";

function BudgetComponent() {
  // Sample data for budget and expenses
  const budgetData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Budget",
        data: [1000, 1200, 900, 1500, 1100, 1000],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const expensesData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Expenses",
        data: [800, 900, 700, 1000, 850, 950],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Create references for the chart canvases
  const pieChartRef = React.useRef(null);
  const barChartRef = React.useRef(null);

  React.useEffect(() => {
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
        data: expensesData,
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
        data: budgetData,
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
      <div className="w-full max-w-3xl bg-white shadow-md p-4">
        <h2 className="text-2xl font-bold mb-4">Budget and Expenses</h2>

        <div className="flex">
          <div className="flex-1 mr-4" style={{ height: "300px" }}>
            <h3 className="text-lg font-bold mb-2">Budget</h3>
            <canvas ref={barChartRef} />
          </div>

          <div className="flex-1" style={{ height: "300px" }}>
            <h3 className="text-lg font-bold mb-2">Expenses</h3>
            <canvas ref={pieChartRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetComponent;
