// src/data/mockCapsules.ts

export type Capsule = {
  id: string;
  creator: string;
  title: string;
  content: string;
  griefScore: number;
  status: "Verified" | "Pending";
  gttEarned: number;
  timestamp: string;
};

export const mockCapsules: Capsule[] = [
  {
    id: "cps001",
    creator: "@cryptoanalyst",
    title: "Bitcoin ETF Approval Impact Analysis",
    content:
      "Comprehensive analysis of Bitcoin ETF approval effects on market dynamics, institutional adoption, and price correlations across major exchanges...",
    griefScore: 9.4,
    status: "Verified",
    gttEarned: 247,
    timestamp: "2 hours ago",
  },
  {
    id: "cps002",
    creator: "@climatetech",
    title: "Climate Research Breakthrough",
    content:
      "Latest findings on carbon capture technology efficiency rates and potential global impact on emission reduction targets...",
    griefScore: 8.7,
    status: "Pending",
    gttEarned: 156,
    timestamp: "5 hours ago",
  },
  {
    id: "cps003",
    creator: "@urbanplanner",
    title: "Urban Development Predictions",
    content:
      "Analysis of smart city infrastructure development trends and their impact on population growth in major metropolitan areas...",
    griefScore: 9.1,
    status: "Verified",
    gttEarned: 189,
    timestamp: "1 day ago",
  },
];
