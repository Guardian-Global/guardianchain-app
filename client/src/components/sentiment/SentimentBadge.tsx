import React from 'react';
import { Brain, Smile, Meh, Frown } from 'lucide-react';

interface SentimentBadgeProps {
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence?: number;
}

const sentimentConfig = {
  positive: {
    color: 'bg-green-600 text-white',
    icon: Smile,
    label: 'POSITIVE',
  },
  neutral: {
    color: 'bg-slate-500 text-white',
    icon: Meh,
    label: 'NEUTRAL',
  },
  negative: {
    color: 'bg-red-600 text-white',
    icon: Frown,
    label: 'NEGATIVE',
  },
};

export default function SentimentBadge({ sentiment, confidence }: SentimentBadgeProps) {
  const config = sentimentConfig[sentiment];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${config.color}`}>
      <Brain className="h-3 w-3" />
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
      {confidence && (
        <span className="text-xs opacity-75">
          {Math.round(confidence * 100)}%
        </span>
      )}
    </div>
  );
}