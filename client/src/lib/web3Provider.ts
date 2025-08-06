// Safe Web3 Provider Initialization
let web3ProviderInitialized = false;

export const initializeWeb3Provider = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      console.log("Web3 provider initialization skipped - server-side render");
      resolve(false);
      return;
    }

    if (web3ProviderInitialized) {
      console.log("Web3 provider already initialized");
      resolve(true);
      return;
    }

    // Check if we're in an iframe context
    try {
      const isIframe = window.parent !== window;
      if (isIframe) {
        console.log("Web3 provider initialization skipped - iframe context detected");
        resolve(false);
        return;
      }
    } catch (e) {
      console.log("Web3 provider initialization skipped - cross-origin iframe");
      resolve(false);
      return;
    }

    if (typeof window.ethereum !== "undefined") {
      console.log("Web3 provider initialized safely");
      web3ProviderInitialized = true;
      resolve(true);
    } else {
      // Wait for MetaMask injection
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max
      
      const checkForProvider = () => {
        attempts++;
        
        if (typeof window.ethereum !== "undefined") {
          console.log("Web3 provider detected successfully");
          web3ProviderInitialized = true;
          resolve(true);
        } else if (attempts >= maxAttempts) {
          console.log("Web3 provider not detected after timeout");
          resolve(false);
        } else {
          setTimeout(checkForProvider, 100);
        }
      };
      
      checkForProvider();
    }
  });
};

export const isWeb3Available = (): boolean => {
  return (
    typeof window !== "undefined" &&
    typeof window.ethereum !== "undefined" &&
    web3ProviderInitialized
  );
};