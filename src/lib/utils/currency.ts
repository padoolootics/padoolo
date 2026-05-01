export const decodeHtmlEntity = (html: string) => {
  if (typeof window === 'undefined') return html; // Return as is on server
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export const formatPrice = (price: string | number | null | undefined, symbol: string = '€') => {
  if (price === null || price === undefined) return "";
  const cleanSymbol = symbol === '&euro;' ? '€' : symbol;
  // If cleanSymbol still contains HTML entities, decode it
  const finalSymbol = cleanSymbol.includes('&') ? decodeHtmlEntity(cleanSymbol) : cleanSymbol;
  
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numericPrice)) return "";
  return `${finalSymbol}${numericPrice.toFixed(2)}`;
};
