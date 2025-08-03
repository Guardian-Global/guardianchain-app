import dynamic from "next/dynamic";
const HeatMap = dynamic(() => import("react-heatmap-grid"), { ssr: false });

const xLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const yLabels = ["Happy", "Sad", "Angry", "Fear", "Grief", "Hope", "Love"];

const data = [
  [1, 1, 2, 3, 4, 5, 6],
  [2, 2, 3, 4, 1, 1, 2],
  [1, 0, 0, 0, 2, 3, 2],
  [2, 3, 4, 1, 1, 0, 0],
  [4, 3, 2, 5, 6, 7, 8],
  [3, 4, 1, 2, 0, 0, 0],
  [1, 2, 3, 2, 1, 0, 0]
];

export default function EmotionHeatmap() {
  return (
    <div className="p-6 border rounded">
      <h3 className="font-bold text-lg mb-2">🧬 Emotion Heatmap</h3>
      <p className="text-xs text-gray-600 mb-4">Based on public griefScore capsules</p>
      <HeatMap
        xLabels={xLabels}
        yLabels={yLabels}
        data={data}
        squares
        height={30}
        background="white"
        cellStyle={(background, value, min, max, data, x, y) => ({
          background: `rgba(255, 0, 0, ${(1.0 * value) / (max || 1)})`,
          fontSize: "10px"
        })}
        cellRender={(value) => value && `${value}`}
      />
    </div>
  );
}
