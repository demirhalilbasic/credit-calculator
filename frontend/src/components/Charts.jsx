import React from "react";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { BarChart3 } from "lucide-react";

// Registruj Chart.js komponente
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Komponenta za prikaz grafova
 */
const Charts = ({ schedule, summary }) => {
  if (!schedule || schedule.length === 0) return null;

  // Priprema podataka za grafove
  const months = schedule.map((item) => `Mj. ${item.month}`);
  const remainingBalance = schedule.map((item) => item.remaining_balance);
  const principalPayments = schedule.map((item) => item.principal);
  const interestPayments = schedule.map((item) => item.interest);

  // Graf 1: Preostali dug kroz vrijeme (linijski)
  const balanceChartData = {
    labels: months,
    datasets: [
      {
        label: "Preostali dug (KM)",
        data: remainingBalance,
        fill: true,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const balanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Preostala glavnica kroz vrijeme",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Preostali dug: ${context.parsed.y.toLocaleString(
              "sr-Latn-BA"
            )} KM`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString("sr-Latn-BA") + " KM";
          },
        },
      },
      x: {
        ticks: {
          maxTicksLimit: 12,
        },
      },
    },
  };

  // Graf 2: Glavnica vs Kamata (stacked bar)
  const paymentBreakdownData = {
    labels: months,
    datasets: [
      {
        label: "Glavnica (KM)",
        data: principalPayments,
        backgroundColor: "rgba(34, 197, 94, 0.8)",
        borderColor: "rgb(34, 197, 94)",
        borderWidth: 1,
      },
      {
        label: "Kamata (KM)",
        data: interestPayments,
        backgroundColor: "rgba(249, 115, 22, 0.8)",
        borderColor: "rgb(249, 115, 22)",
        borderWidth: 1,
      },
    ],
  };

  const paymentBreakdownOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Struktura mjesečnih rata (Glavnica vs Kamata)",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString(
              "sr-Latn-BA"
            )} KM`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          maxTicksLimit: 12,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString("sr-Latn-BA") + " KM";
          },
        },
      },
    },
  };

  // Graf 3: Ukupna distribucija plaćanja (doughnut)
  const totalDistributionData = {
    labels: ["Glavnica", "Kamata"],
    datasets: [
      {
        data: [summary.total_amount, summary.total_interest],
        backgroundColor: ["rgba(34, 197, 94, 0.8)", "rgba(249, 115, 22, 0.8)"],
        borderColor: ["rgb(34, 197, 94)", "rgb(249, 115, 22)"],
        borderWidth: 2,
      },
    ],
  };

  const totalDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      title: {
        display: true,
        text: "Ukupna distribucija troškova",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value.toLocaleString(
              "sr-Latn-BA"
            )} KM (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <BarChart3 className="w-6 h-6 text-primary-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Vizuelni prikazi</h2>
      </div>

      {/* Graf 1: Linijski graf preostalog duga */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div style={{ height: "400px" }}>
          <Line data={balanceChartData} options={balanceChartOptions} />
        </div>
      </div>

      {/* Graf 2 i 3: Paralelni prikaz */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graf 2: Stacked bar */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div style={{ height: "400px" }}>
            <Bar
              data={paymentBreakdownData}
              options={paymentBreakdownOptions}
            />
          </div>
        </div>

        {/* Graf 3: Doughnut */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div
            style={{ height: "400px" }}
            className="flex items-center justify-center"
          >
            <Doughnut
              data={totalDistributionData}
              options={totalDistributionOptions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
