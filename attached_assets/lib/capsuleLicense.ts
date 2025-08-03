export function generateCapsuleLicense({ capsuleId, author, griefScore }) {
  const license = {
    capsuleId,
    author,
    issuedAt: new Date().toISOString(),
    griefScore,
    licenseHash: "0x" + Buffer.from(capsuleId + griefScore).toString("hex").slice(0, 64)
  };
  return license;
}
