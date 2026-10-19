// Danish address autofill utility using DAWA API
// Usage: Call autofillDanishAddress(query) with a partial address string

export async function autofillDanishAddress(query: string) {
  if (!query || query.length < 3) return null;
  const url = `https://api.dataforsyningen.dk/adresser/autocomplete?q=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch address suggestions');
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return data
      .map((item) => item?.adresse)
      .filter(Boolean);
  } catch (error) {
    console.error('Address autofill error:', error);
    return null;
  }
}
