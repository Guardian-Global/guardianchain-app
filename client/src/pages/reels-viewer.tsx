import ReelSwiper from "@/components/reels/ReelSwiper";
import { useParams } from "wouter";

export default function ReelsViewer() {
  const params = useParams();
  const reelId = params?.id;

  return (
    <div className="min-h-screen">
      <ReelSwiper reelId={reelId} autoplay={true} fullscreen={true} />
    </div>
  );
}
