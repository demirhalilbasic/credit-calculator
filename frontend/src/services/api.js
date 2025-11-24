import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * API servis za komunikaciju sa backend-om
 */
export const creditAPI = {
  /**
   * Izračunaj kredit (anuitetni ili linearni)
   */
  calculateCredit: async (creditData) => {
    const response = await api.post("/calculate", creditData);
    return response.data;
  },

  /**
   * Izračunaj kredit sa prijevremenom otplatom
   */
  calculateWithPrepayment: async (creditData, prepaymentData) => {
    const response = await api.post("/calculate/prepayment", {
      credit: creditData,
      prepayment: prepaymentData,
    });
    return response.data;
  },

  /**
   * Simulacija promjene kamatne stope
   */
  calculateRateChange: async (creditData, rateChange) => {
    const response = await api.post("/calculate/rate-change", {
      credit: creditData,
      rate_change: rateChange,
    });
    return response.data;
  },

  /**
   * Uporedi više kredita
   */
  compareCredits: async (creditsArray) => {
    const response = await api.post("/compare", {
      credits: creditsArray,
    });
    return response.data;
  },

  /**
   * Preuzmi PDF izvještaj
   */
  downloadPDF: async (creditData) => {
    const response = await api.post("/export/pdf", creditData, {
      responseType: "blob",
    });

    // Kreiraj download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `kredit_izvjestaj_${new Date().getTime()}.pdf`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  /**
   * Preuzmi uporedni PDF izvještaj
   */
  downloadComparisonPDF: async (creditsArray) => {
    const response = await api.post(
      "/export/comparison-pdf",
      {
        credits: creditsArray,
      },
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `uporedba_kredita_${new Date().getTime()}.pdf`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

export default api;
