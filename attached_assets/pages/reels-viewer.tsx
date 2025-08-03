import { useEffect, useState } from "react";

const mockReel = [
  { id: "1", title: "Capsule One", url: "/assets/capsule1.mp4" },
  { id: "2", title: "Capsule Two", url: "/assets/capsule2.mp4" },
  { id: "3", title: "Capsule Three", url: "/assets/capsule3.mp4" }
];

export default function ReelsViewer() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % mockReel.length);
    }, 6000); // autoplay every 6s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
      <video key={mockReel[index].id} src={mockReel[index].url} autoPlay muted loop className="w-full h-full object-cover" />
      <div className="absolute bottom-10 text-center w-full text-xl font-bold">
        {mockReel[index].title}
      </div>
    </div>
  );
}
