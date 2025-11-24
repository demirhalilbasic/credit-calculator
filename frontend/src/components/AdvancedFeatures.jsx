import React, { useState } from "react";
import { Settings, DollarSign, Percent } from "lucide-react";

/**
 * Panel sa naprednim funkcionalnostima
 */
const AdvancedFeatures = ({ creditData, onPrepayment, onRateChange }) => {
  const [activeTab, setActiveTab] = useState("prepayment");

  // Prijevremena otplata state
  const [prepaymentData, setPrepaymentData] = useState({
    amount: "",
    month: "",
    type: "partial",
  });

  // Promjena kamatne stope state
  const [rateChangeData, setRateChangeData] = useState({
    rate_change: "1",
  });

  const handlePrepaymentSubmit = (e) => {
    e.preventDefault();
    if (!creditData) {
      alert("Prvo izračunajte osnovni kredit");
      return;
    }

    onPrepayment({
      prepayment: {
        amount: parseFloat(prepaymentData.amount),
        month: parseInt(prepaymentData.month),
        type: prepaymentData.type,
      },
    });
  };

  const handleRateChangeSubmit = (e) => {
    e.preventDefault();
    if (!creditData) {
      alert("Prvo izračunajte osnovni kredit");
      return;
    }

    onRateChange({
      rate_change: parseFloat(rateChangeData.rate_change),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Settings className="w-6 h-6 text-primary-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">
          Napredne funkcionalnosti
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("prepayment")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "prepayment"
              ? "border-b-2 border-primary-600 text-primary-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Prijevremena otplata
        </button>
        <button
          onClick={() => setActiveTab("rateChange")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "rateChange"
              ? "border-b-2 border-primary-600 text-primary-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Promjena kamate
        </button>
      </div>

      {/* Prijevremena otplata */}
      {activeTab === "prepayment" && (
        <form onSubmit={handlePrepaymentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Iznos prijevremene otplate (KM)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={prepaymentData.amount}
                onChange={(e) =>
                  setPrepaymentData((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="npr. 10000"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mjesec prijevremene otplate
            </label>
            <input
              type="number"
              value={prepaymentData.month}
              onChange={(e) =>
                setPrepaymentData((prev) => ({
                  ...prev,
                  month: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="npr. 12"
              min="1"
              max={creditData?.term_months || 360}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Unesite mjesec u kojem želite izvršiti prijevremenu otplatu
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tip otplate
            </label>
            <select
              value={prepaymentData.type}
              onChange={(e) =>
                setPrepaymentData((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="partial">Djelimična otplata</option>
              <option value="full">Potpuna otplata</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Simuliraj prijevremenu otplatu
          </button>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-sm text-blue-700">
              <strong>Napomena:</strong> Prijevremena otplata smanjuje ukupne
              troškove kredita jer se smanjuje glavnica na koju se obračunava
              kamata.
            </p>
          </div>
        </form>
      )}

      {/* Promjena kamatne stope */}
      {activeTab === "rateChange" && (
        <form onSubmit={handleRateChangeSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Promjena kamatne stope (%)
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={rateChangeData.rate_change}
                onChange={(e) =>
                  setRateChangeData({ rate_change: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="npr. 1 ili -0.5"
                step="0.01"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Pozitivna vrijednost povećava, negativna smanjuje kamatnu stopu
            </p>
          </div>

          {/* Brzi linkovi */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRateChangeData({ rate_change: "1" })}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors"
            >
              +1%
            </button>
            <button
              type="button"
              onClick={() => setRateChangeData({ rate_change: "0.5" })}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors"
            >
              +0.5%
            </button>
            <button
              type="button"
              onClick={() => setRateChangeData({ rate_change: "-0.5" })}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors"
            >
              -0.5%
            </button>
            <button
              type="button"
              onClick={() => setRateChangeData({ rate_change: "-1" })}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm transition-colors"
            >
              -1%
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Simuliraj promjenu kamate
          </button>

          {creditData && (
            <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
              <p className="text-sm text-purple-700">
                <strong>Trenutna kamatna stopa:</strong>{" "}
                {creditData.annual_interest_rate}%<br />
                <strong>Nova kamatna stopa bi bila:</strong>{" "}
                {(
                  creditData.annual_interest_rate +
                  parseFloat(rateChangeData.rate_change || 0)
                ).toFixed(2)}
                %
              </p>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default AdvancedFeatures;
