export default function OneClickShare({ text, url }) {
  const handleShare = () => {
    const shareData = {
      title: "My Grief Capsule",
      text,
      url,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      alert("Web share not supported.");
    }
  };

  return (
    <div className="p-2">
      <button onClick={handleShare} className="px-4 py-2 bg-purple-600 text-white rounded">
        📤 One-Click Share (SMS / Social / Email)
      </button>
    </div>
  );
}
