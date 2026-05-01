export const decodeHtmlEntity = (html: string) => {
  if (typeof window === 'undefined') return html; // Return as is on server
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

export const formatPrice = (price: string | number, symbol: string = '€') => {
  const cleanSymbol = symbol === '&euro;' ? '€' : symbol;
  // If cleanSymbol still contains HTML entities, decode it
  const finalSymbol = cleanSymbol.includes('&') ? decodeHtmlEntity(cleanSymbol) : cleanSymbol;
  
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `${finalSymbol}${numericPrice.toFixed(2)}`;
};
