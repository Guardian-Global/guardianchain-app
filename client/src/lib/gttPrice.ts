// Fetches GTT price from on-chain oracle or CoinGecko
export async function fetchGTTPrice() {
  try {
    // For development, return a realistic mock price with slight variations
    // In production, replace with your contract/oracle endpoint
    const basePrice = 0.15;
    const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
    const mockPrice = basePrice + variation;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return Number(mockPrice.toFixed(4));
  } catch (error) {
    console.error('Error fetching GTT price:', error);
    return 0.15; // Fallback price
  }
}

// Get price change percentage over 24h
export async function fetchGTTPriceChange() {
  try {
    // Mock 24h price change data
    const changes = [-2.5, 1.8, 0.3, -0.7, 3.2, -1.1, 2.9];
    const randomChange = changes[Math.floor(Math.random() * changes.length)];
    
    return {
      change: randomChange,
      isPositive: randomChange >= 0
    };
  } catch (error) {
    console.error('Error fetching GTT price change:', error);
    return { change: 0, isPositive: true };
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
      totalSupply
    };
  } catch (error) {
    console.error('Error fetching GTT market data:', error);
    return {
      price: 0.15,
      marketCap: 375000,
      volume24h: 18750,
      circulatingSupply: 2500000,
      totalSupply: 10000000
    };
  }
}