export const searchDefinition = (text) => {
  const query = `define ${text}`;
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  window.open(url, "_blank");
};
