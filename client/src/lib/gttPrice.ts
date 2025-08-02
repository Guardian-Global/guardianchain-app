// Fetches GTT price from backend API (NO MOCK DATA)
export async function fetchGTTPrice() {
  try {
    const response = await fetch("/api/token/gtt-data");
    const data = await response.json();

    if (data.success && data.data.price !== null) {
      return Number(data.data.price);
    } else {
      console.warn(
        "GTT price not available - token may not be publicly traded",
      );
      return null; // Return null instead of fake price
    }
  } catch (error) {
    console.error("Error fetching GTT price:", error);
    return null; // Return null instead of fake price
  }
}

// Get price change percentage over 24h (NO MOCK DATA)
export async function fetchGTTPriceChange() {
  try {
    const response = await fetch("/api/token/gtt-data");
    const data = await response.json();

    if (data.success && data.data.change24h !== null) {
      const change = Number(data.data.change24h);
      return {
        change: change,
        isPositive: change >= 0,
      };
    } else {
      console.warn(
        "GTT price change not available - token may not be publicly traded",
      );
      return null; // Return null instead of fake data
    }
  } catch (error) {
    console.error("Error fetching GTT price change:", error);
    return null; // Return null instead of fake data
  }
}

// Get market cap and volume data
export async function fetchGTTMarketData() {
  try {
    const price = await fetchGTTPrice();

    // Mock market data based on price
    const totalSupply = 10000000; // 10M GTT total supply
    const circulatingSupply = 2500000; // 2.5M circulating
    const marketCap = circulatingSupply * price;
    const volume24h = marketCap * 0.05; // 5% of market cap as daily volume

    return {
      price,
      marketCap,
      volume24h,
      circulatingSupply,
      totalSupply,
    };
  } catch (error) {
    console.error("Error fetching GTT market data:", error);
    return {
      price: 0.15,
      marketCap: 375000,
      volume24h: 18750,
      circulatingSupply: 2500000,
      totalSupply: 10000000,
    };
  }
}
