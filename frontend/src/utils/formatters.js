/**
 * Utility funkcije za formatiranje
 */

/**
 * Formatira broj kao valutu sa decimalama
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("sr-Latn-BA", {
    style: "currency",
    currency: "BAM",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formatira procenat
 */
export const formatPercent = (value) => {
  return `${value.toFixed(2)}%`;
};

/**
 * Formatira datum
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("sr-Latn-BA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/**
 * Validacija iznosa kredita
 */
export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

/**
 * Validacija kamatne stope
 */
export const validateInterestRate = (rate) => {
  const num = parseFloat(rate);
  return !isNaN(num) && num >= 0 && num <= 100;
};

/**
 * Validacija roka otplate
 */
export const validateTerm = (term) => {
  const num = parseInt(term);
  return !isNaN(num) && num > 0 && num <= 480; // max 40 godina
};

/**
 * Konvertuje godine u mjesece
 */
export const yearsToMonths = (years) => {
  return years * 12;
};

/**
 * Konvertuje mjesece u godine
 */
export const monthsToYears = (months) => {
  return (months / 12).toFixed(1);
};
