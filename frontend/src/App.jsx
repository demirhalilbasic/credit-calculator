import React, { useState } from "react";
import { Download, FileText } from "lucide-react";
import CreditForm from "./components/CreditForm";
import CreditSummary from "./components/CreditSummary";
import PaymentScheduleTable from "./components/PaymentScheduleTable";
import Charts from "./components/Charts";
import AdvancedFeatures from "./components/AdvancedFeatures";
import ComparisonTool from "./components/ComparisonTool";
import { creditAPI } from "./services/api";

function App() {
  const [loading, setLoading] = useState(false);
  const [creditData, setCreditData] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("calculator");

  /**
   * Izračunaj osnovni kredit
   */
  const handleCalculate = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await creditAPI.calculateCredit(data);
      setResult(response);
      setCreditData(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Greška pri izračunu kredita");
      console.error("Error calculating credit:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Prijevremena otplata
   */
  const handlePrepayment = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await creditAPI.calculateWithPrepayment(
        creditData,
        data.prepayment
      );
      setResult(response);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Greška pri simulaciji prijevremene otplate"
      );
      console.error("Error with prepayment:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Promjena kamatne stope
   */
  const handleRateChange = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await creditAPI.calculateRateChange(creditData, {
        rate_change: data.rate_change,
      });
      setResult(response);
      // Ažuriraj kreditData sa novom stopom
      setCreditData({
        ...creditData,
        annual_interest_rate:
          creditData.annual_interest_rate + data.rate_change,
      });
    } catch (err) {
      setError(
        err.response?.data?.detail || "Greška pri simulaciji promjene kamate"
      );
      console.error("Error with rate change:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Preuzmi PDF
   */
  const handleDownloadPDF = async () => {
    if (!creditData) {
      alert("Prvo izračunajte kredit");
      return;
    }

    try {
      await creditAPI.downloadPDF(creditData);
    } catch (err) {
      alert("Greška pri generisanju PDF-a");
      console.error("Error downloading PDF:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Kreditni Kalkulator</h1>
          <p className="text-primary-100">
            Profesionalni kalkulator za anuitetne i linearne kredite
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveView("calculator")}
              className={`px-4 py-3 font-medium transition-colors ${
                activeView === "calculator"
                  ? "border-b-2 border-primary-600 text-primary-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Kalkulator
            </button>
            <button
              onClick={() => setActiveView("comparison")}
              className={`px-4 py-3 font-medium transition-colors ${
                activeView === "comparison"
                  ? "border-b-2 border-primary-600 text-primary-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Uporedba kredita
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeView === "calculator" ? (
          <>
            {/* Error Alert */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Forma za unos */}
              <div className="lg:col-span-1">
                <CreditForm onCalculate={handleCalculate} loading={loading} />
              </div>

              {/* Sažetak */}
              <div className="lg:col-span-2">
                {result ? (
                  <CreditSummary
                    summary={result.summary}
                    creditData={creditData}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Nema rezultata
                    </h3>
                    <p className="text-gray-500">
                      Unesite parametre kredita i kliknite "Izračunaj kredit"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Napredne funkcionalnosti */}
            {result && (
              <div className="mb-6">
                <AdvancedFeatures
                  creditData={creditData}
                  onPrepayment={handlePrepayment}
                  onRateChange={handleRateChange}
                />
              </div>
            )}

            {/* Akcije - PDF download */}
            {result && (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors shadow-md"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Preuzmi PDF izvještaj
                </button>
              </div>
            )}

            {/* Grafovi */}
            {result && (
              <div className="mb-6">
                <Charts schedule={result.schedule} summary={result.summary} />
              </div>
            )}

            {/* Otplatni plan */}
            {result && (
              <div>
                <PaymentScheduleTable schedule={result.schedule} />
              </div>
            )}
          </>
        ) : (
          <ComparisonTool />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              &copy; 2025 Kreditni Kalkulator. Sva prava zadržana.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Napomena: Ovaj kalkulator služi samo za informativne svrhe. Za
              precizne podatke konsultujte se sa vašom bankom.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
