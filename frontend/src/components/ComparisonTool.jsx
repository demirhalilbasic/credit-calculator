import React, { useState } from "react";
import { Plus, Trash2, Download, GitCompare } from "lucide-react";
import { creditAPI } from "../services/api";
import { formatCurrency, formatPercent } from "../utils/formatters";

/**
 * Komponenta za uporedbu više kredita
 */
const ComparisonTool = () => {
  const [credits, setCredits] = useState([
    {
      id: 1,
      amount: "",
      annual_interest_rate: "",
      term_months: "",
      payment_type: "annuity",
    },
  ]);

  const [comparisonResult, setComparisonResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const addCredit = () => {
    if (credits.length >= 3) {
      alert("Maksimalno 3 kredita za uporedbu");
      return;
    }

    setCredits([
      ...credits,
      {
        id: credits.length + 1,
        amount: "",
        annual_interest_rate: "",
        term_months: "",
        payment_type: "annuity",
      },
    ]);
  };

  const removeCredit = (id) => {
    if (credits.length <= 1) {
      alert("Minimalno 1 kredit je potreban");
      return;
    }

    setCredits(credits.filter((credit) => credit.id !== id));
  };

  const updateCredit = (id, field, value) => {
    setCredits(
      credits.map((credit) =>
        credit.id === id ? { ...credit, [field]: value } : credit
      )
    );
  };

  const handleCompare = async () => {
    // Validacija
    for (const credit of credits) {
      if (
        !credit.amount ||
        !credit.annual_interest_rate ||
        !credit.term_months
      ) {
        alert("Popunite sve podatke za sve kredite");
        return;
      }
    }

    setLoading(true);

    try {
      const creditsData = credits.map((credit) => ({
        amount: parseFloat(credit.amount),
        annual_interest_rate: parseFloat(credit.annual_interest_rate),
        term_months: parseInt(credit.term_months),
        payment_type: credit.payment_type,
        start_date: new Date().toISOString().split("T")[0],
      }));

      const response = await creditAPI.compareCredits(creditsData);
      setComparisonResult(response);
    } catch (err) {
      alert("Greška pri uporedbi kredita");
      console.error("Error comparing credits:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadComparisonPDF = async () => {
    if (!comparisonResult) {
      alert("Prvo uporedite kredite");
      return;
    }

    try {
      const creditsData = credits.map((credit) => ({
        amount: parseFloat(credit.amount),
        annual_interest_rate: parseFloat(credit.annual_interest_rate),
        term_months: parseInt(credit.term_months),
        payment_type: credit.payment_type,
        start_date: new Date().toISOString().split("T")[0],
      }));

      await creditAPI.downloadComparisonPDF(creditsData);
    } catch (err) {
      alert("Greška pri generisanju PDF-a");
      console.error("Error downloading comparison PDF:", err);
    }
  };

  const getBestCredit = () => {
    if (!comparisonResult) return null;

    const comparisons = comparisonResult.comparisons;
    let bestIndex = 0;
    let minCost = comparisons[0].summary.total_cost;

    comparisons.forEach((comp, index) => {
      if (comp.summary.total_cost < minCost) {
        minCost = comp.summary.total_cost;
        bestIndex = index;
      }
    });

    return bestIndex;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <GitCompare className="w-6 h-6 text-primary-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">
              Uporedba Kredita
            </h2>
          </div>
          <button
            onClick={addCredit}
            disabled={credits.length >= 3}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Dodaj kredit
          </button>
        </div>

        {/* Krediti za uporedbu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {credits.map((credit, index) => (
            <div
              key={credit.id}
              className="border border-gray-200 rounded-lg p-4 relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">
                  Kredit {index + 1}
                </h3>
                {credits.length > 1 && (
                  <button
                    onClick={() => removeCredit(credit.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Iznos (KM)
                  </label>
                  <input
                    type="number"
                    value={credit.amount}
                    onChange={(e) =>
                      updateCredit(credit.id, "amount", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="50000"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Kamata (%)
                  </label>
                  <input
                    type="number"
                    value={credit.annual_interest_rate}
                    onChange={(e) =>
                      updateCredit(
                        credit.id,
                        "annual_interest_rate",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="5.5"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Rok (mjeseci)
                  </label>
                  <input
                    type="number"
                    value={credit.term_months}
                    onChange={(e) =>
                      updateCredit(credit.id, "term_months", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="60"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Tip
                  </label>
                  <select
                    value={credit.payment_type}
                    onChange={(e) =>
                      updateCredit(credit.id, "payment_type", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="annuity">Anuitetni</option>
                    <option value="linear">Linearni</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleCompare}
          disabled={loading || credits.length < 2}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Uporedba u toku...
            </>
          ) : (
            <>
              <GitCompare className="w-5 h-5 mr-2" />
              Uporedi kredite
            </>
          )}
        </button>
      </div>

      {/* Rezultat uporedbe */}
      {comparisonResult && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Rezultati uporedbe
              </h2>
              <button
                onClick={handleDownloadComparisonPDF}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Preuzmi PDF
              </button>
            </div>

            {/* Uporedna tabela */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Parametar
                    </th>
                    {comparisonResult.comparisons.map((_, index) => (
                      <th
                        key={index}
                        className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                      >
                        Kredit {index + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      Iznos kredita
                    </td>
                    {comparisonResult.comparisons.map((comp, index) => (
                      <td key={index} className="px-4 py-3 text-sm text-center">
                        {formatCurrency(comp.summary.total_amount)}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      Kamatna stopa
                    </td>
                    {comparisonResult.comparisons.map((comp, index) => (
                      <td key={index} className="px-4 py-3 text-sm text-center">
                        {formatPercent(comp.input.annual_interest_rate)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      Rok (mjeseci)
                    </td>
                    {comparisonResult.comparisons.map((comp, index) => (
                      <td key={index} className="px-4 py-3 text-sm text-center">
                        {comp.input.term_months}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      Tip otplate
                    </td>
                    {comparisonResult.comparisons.map((comp, index) => (
                      <td key={index} className="px-4 py-3 text-sm text-center">
                        {comp.summary.payment_type}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-orange-50">
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">
                      Ukupna kamata
                    </td>
                    {comparisonResult.comparisons.map((comp, index) => (
                      <td
                        key={index}
                        className="px-4 py-3 text-sm text-center font-semibold text-orange-700"
                      >
                        {formatCurrency(comp.summary.total_interest)}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-4 py-3 text-sm font-bold text-gray-900">
                      Ukupni trošak
                    </td>
                    {comparisonResult.comparisons.map((comp, index) => {
                      const bestIndex = getBestCredit();
                      return (
                        <td
                          key={index}
                          className={`px-4 py-3 text-sm text-center font-bold ${
                            index === bestIndex
                              ? "text-green-700 bg-green-100"
                              : "text-gray-900"
                          }`}
                        >
                          {formatCurrency(comp.summary.total_cost)}
                          {index === bestIndex && (
                            <span className="block text-xs mt-1">
                              ✓ Najbolja opcija
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      Prosječna rata
                    </td>
                    {comparisonResult.comparisons.map((comp, index) => (
                      <td key={index} className="px-4 py-3 text-sm text-center">
                        {formatCurrency(comp.summary.monthly_payment_avg)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Preporuka */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-400 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-green-800 mb-2">Preporuka</h3>
            <p className="text-green-700">
              Najisplativija opcija je{" "}
              <strong>Kredit {getBestCredit() + 1}</strong> sa ukupnim troškom
              od{" "}
              <strong>
                {formatCurrency(
                  comparisonResult.comparisons[getBestCredit()].summary
                    .total_cost
                )}
              </strong>
              .
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ComparisonTool;
