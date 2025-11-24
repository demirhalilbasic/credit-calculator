import React from "react";
import { DollarSign, Percent, TrendingUp, Calendar } from "lucide-react";
import { formatCurrency, formatPercent } from "../utils/formatters";

/**
 * Komponenta za prikaz sažetka kredita
 */
const CreditSummary = ({ summary, creditData }) => {
  if (!summary) return null;

  const savingsPercent = (
    (summary.total_interest / summary.total_amount) *
    100
  ).toFixed(2);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sažetak Kredita</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Ukupan iznos */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Iznos kredita</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.total_amount)}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        {/* Ukupna kamata */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ukupna kamata</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.total_interest)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {savingsPercent}% od glavnice
              </p>
            </div>
            <Percent className="w-10 h-10 text-orange-600" />
          </div>
        </div>

        {/* Ukupni trošak */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ukupni trošak</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.total_cost)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Glavnica + Kamata</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600" />
          </div>
        </div>

        {/* Prosječna rata */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                {summary.payment_type === "Anuitetni"
                  ? "Mjesečna rata"
                  : "Prosječna rata"}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.monthly_payment_avg)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {creditData?.term_months} mjeseci
              </p>
            </div>
            <Calendar className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Dodatne informacije */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Tip otplate:</span>
            <span className="ml-2 font-semibold text-gray-900">
              {summary.payment_type}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Kamatna stopa:</span>
            <span className="ml-2 font-semibold text-gray-900">
              {formatPercent(creditData?.annual_interest_rate || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Upozorenje o ukupnim troškovima */}
      {savingsPercent > 30 && (
        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Upozorenje:</strong> Ukupna kamata prelazi 30% iznosa
                kredita. Razmotrite kraći rok otplate ili nižu kamatnu stopu.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Info o uštedi sa prijevremenom otplatom */}
      {summary.prepayment_savings && (
        <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Ušteda sa prijevremenom otplatom:</strong>{" "}
                {formatCurrency(summary.prepayment_savings)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditSummary;
