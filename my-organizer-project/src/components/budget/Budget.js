import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

export default function BudgetComponent({ user }) {
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
      <div className="bg-green-200 h-12 flex gap-1 rounded-t-lg w-full items-center justify-center p-3 font-bold">
        <div>My Budget Summary</div>
        <svg className="h-6 w-6 cf-icon-svg" fill="#000000" viewBox="-1.7 0 20.4 20.4" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M16.417 10.283A7.917 7.917 0 1 1 8.5 2.366a7.916 7.916 0 0 1 7.917 7.917zm-4.844 1.754a2.249 2.249 0 0 0-.556-1.477l-.001-.002a3.02 3.02 0 0 0-.835-.665l-.003-.002a3.498 3.498 0 0 0-.866-.313H9.31a3.78 3.78 0 0 0-.795-.083 2.849 2.849 0 0 1-.475-.037 1.8 1.8 0 0 1-.494-.158l-.002-.001a1.17 1.17 0 0 1-.371-.298L7.172 9a.733.733 0 0 1-.175-.44.749.749 0 0 1 .421-.63 2.157 2.157 0 0 1 1.11-.297 2.283 2.283 0 0 1 .391.066l.049.01a2.479 2.479 0 0 1 .473.166 1.33 1.33 0 0 1 .381.261.792.792 0 1 0 1.118-1.12 2.902 2.902 0 0 0-.85-.585 3.996 3.996 0 0 0-.785-.268h-.001l-.008-.002v-.786a.792.792 0 1 0-1.583 0v.763a3.557 3.557 0 0 0-1.14.454 2.328 2.328 0 0 0-1.159 1.967 2.296 2.296 0 0 0 .529 1.44 2.724 2.724 0 0 0 .894.717 3.342 3.342 0 0 0 .942.305 4.398 4.398 0 0 0 .736.059 2.202 2.202 0 0 1 .46.046 1.927 1.927 0 0 1 .467.168 1.431 1.431 0 0 1 .382.308.674.674 0 0 1 .165.436c0 .097 0 .324-.385.573a2.182 2.182 0 0 1-1.132.314 3.515 3.515 0 0 1-.494-.06 2.381 2.381 0 0 1-.459-.148h-.001a.953.953 0 0 1-.356-.274.792.792 0 1 0-1.197 1.037 2.516 2.516 0 0 0 .967.708 3.799 3.799 0 0 0 .774.237h.007v.783a.792.792 0 1 0 1.583 0v-.79a3.581 3.581 0 0 0 1.17-.479 2.215 2.215 0 0 0 1.107-1.9z"></path>
          </g>
        </svg>
      </div>
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
