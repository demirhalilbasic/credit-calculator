import React, { useState } from "react";
import { Table as TableIcon, Download } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/formatters";

/**
 * Komponenta za prikaz otplatnog plana u tabeli
 */
const PaymentScheduleTable = ({ schedule }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  if (!schedule || schedule.length === 0) return null;

  const totalPages = Math.ceil(schedule.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = schedule.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const exportToCSV = () => {
    const headers = [
      "Mjesec",
      "Datum",
      "Rata (KM)",
      "Glavnica (KM)",
      "Kamata (KM)",
      "Preostali dug (KM)",
    ];
    const rows = schedule.map((item) => [
      item.month,
      item.payment_date,
      item.monthly_payment.toFixed(2),
      item.principal.toFixed(2),
      item.interest.toFixed(2),
      item.remaining_balance.toFixed(2),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `otplatni_plan_${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TableIcon className="w-6 h-6 text-primary-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Otplatni Plan</h2>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Izvezi CSV
        </button>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mj.
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Datum
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rata (KM)
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Glavnica
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kamata
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preostali dug
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((item, index) => (
              <tr
                key={item.month}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition-colors`}
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.month}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(item.payment_date)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                  {formatCurrency(item.monthly_payment)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-700">
                  {formatCurrency(item.principal)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-orange-600">
                  {formatCurrency(item.interest)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                  {formatCurrency(item.remaining_balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginacija */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-4">
          <div className="text-sm text-gray-600">
            Prikazujem {startIndex + 1}-{Math.min(endIndex, schedule.length)} od{" "}
            {schedule.length} mjeseci
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Prethodna
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Prikaži prvu, posljednju, trenutnu i susjedne stranice
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, array) => {
                  // Dodaj "..." između stranica
                  const prevPage = array[index - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && (
                        <span className="px-2 py-1 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-primary-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sljedeća
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentScheduleTable;
