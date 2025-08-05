export const reownFallbackConfig = {
  environment: 'development',
  features: {
    aiVoiceRecall: true,
    capsuleMinting: true,
    daoLedger: true,
    onboardingFlow: true
  },
  origin: process.env.REOWN_ORIGIN || 'fallback.local.dev'
};

// Reown configuration with fallback
export async function getReownConfig() {
  try {
    const res = await fetch(`https://cloud.reown.com/config?origin=${window.location.origin}`);
    const config = await res.json();
    return config;
  } catch (e) {
    console.warn('⚠️ Reown config fetch failed, using fallback.');
    return reownFallbackConfig;
  }
}