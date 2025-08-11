import { calculateCapsuleYield } from "../client/src/lib/yieldEngine";

(async () => {
  const y1 = await calculateCapsuleYield(1);
  const y2 = await calculateCapsuleYield(2);
  console.log(JSON.stringify({ y1, y2 }));
})();
