import React, { useState } from "react";
import { Calculator, TrendingUp } from "lucide-react";
import {
  validateAmount,
  validateInterestRate,
  validateTerm,
  yearsToMonths,
} from "../utils/formatters";

/**
 * Forma za unos parametara kredita
 */
const CreditForm = ({ onCalculate, loading }) => {
  const [formData, setFormData] = useState({
    amount: "",
    annual_interest_rate: "",
    term_months: "",
    term_unit: "months",
    payment_type: "annuity",
    start_date: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Očisti grešku za polje
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!validateAmount(formData.amount)) {
      newErrors.amount = "Unesite validan iznos kredita (veći od 0)";
    }

    if (!validateInterestRate(formData.annual_interest_rate)) {
      newErrors.annual_interest_rate = "Unesite validnu kamatnu stopu (0-100%)";
    }

    const termValue =
      formData.term_unit === "years"
        ? yearsToMonths(parseFloat(formData.term_months))
        : formData.term_months;

    if (!validateTerm(termValue)) {
      newErrors.term_months = "Unesite validan rok otplate (1-480 mjeseci)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const termInMonths =
      formData.term_unit === "years"
        ? yearsToMonths(parseFloat(formData.term_months))
        : parseInt(formData.term_months);

    const creditData = {
      amount: parseFloat(formData.amount),
      annual_interest_rate: parseFloat(formData.annual_interest_rate),
      term_months: termInMonths,
      payment_type: formData.payment_type,
      start_date: formData.start_date,
    };

    onCalculate(creditData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Calculator className="w-6 h-6 text-primary-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Parametri Kredita</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Iznos kredita */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Iznos kredita (KM)
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.amount ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="npr. 50000"
            step="0.01"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* Kamatna stopa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Godišnja kamatna stopa (%)
          </label>
          <input
            type="number"
            name="annual_interest_rate"
            value={formData.annual_interest_rate}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
              errors.annual_interest_rate ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="npr. 5.5"
            step="0.01"
          />
          {errors.annual_interest_rate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.annual_interest_rate}
            </p>
          )}
        </div>

        {/* Rok otplate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rok otplate
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              name="term_months"
              value={formData.term_months}
              onChange={handleChange}
              className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.term_months ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="npr. 60"
              step="1"
            />
            <select
              name="term_unit"
              value={formData.term_unit}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="months">Mjeseci</option>
              <option value="years">Godina</option>
            </select>
          </div>
          {errors.term_months && (
            <p className="mt-1 text-sm text-red-600">{errors.term_months}</p>
          )}
        </div>

        {/* Tip otplate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tip otplate
          </label>
          <select
            name="payment_type"
            value={formData.payment_type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="annuity">Anuitetni model (fiksna rata)</option>
            <option value="linear">Linearni model (opadajuća rata)</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            {formData.payment_type === "annuity"
              ? "Ista rata svaki mjesec"
              : "Rata opada tokom vremena"}
          </p>
        </div>

        {/* Datum početka */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Datum početka otplate
          </label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Submit dugme */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Računam...
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5 mr-2" />
              Izračunaj kredit
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreditForm;
