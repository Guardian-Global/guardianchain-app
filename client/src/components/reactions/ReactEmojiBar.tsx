import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import useSWR from 'swr';
import { useAuth } from '@/hooks/useAuth';

const emojis = ['❤️', '🔥', '😂', '😢', '👏', '🤯'];

interface ReactEmojiBarProps {
  capsuleId: string;
}

export default function ReactEmojiBar({ capsuleId }: ReactEmojiBarProps) {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const queryClient = useQueryClient();

  const { data: reactionData } = useSWR(`/api/capsule/reactions/${capsuleId}`);

  useEffect(() => {
    if (reactionData) {
      setReactions(reactionData);
    }
  }, [reactionData]);

  const reactMutation = useMutation({
    mutationFn: async (emoji: string) => {
      return apiRequest('/api/capsule/react', {
        method: 'POST',
        body: JSON.stringify({
          capsuleId,
          emoji,
          userId: user?.id || 'dev-user-123',
        }),
      });
    },
    onSuccess: (_, emoji) => {
      setReactions(prev => ({
        ...prev,
        [emoji]: (prev[emoji] || 0) + 1,
      }));
      queryClient.invalidateQueries({ queryKey: [`/api/capsule/reactions/${capsuleId}`] });
    },
  });

  const handleReact = async (emoji: string) => {
    reactMutation.mutate(emoji);
  };

  return (
    <div className="flex gap-2 items-center p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
      <span className="text-sm text-[#8b949e] mr-2">React:</span>
      {emojis.map(emoji => (
        <button
          key={emoji}
          onClick={() => handleReact(emoji)}
          disabled={reactMutation.isPending}
          className="flex items-center gap-1 px-2 py-1 text-lg hover:scale-125 transition-transform duration-200 hover:bg-[#21262d] rounded-md disabled:opacity-50"
          data-testid={`emoji-button-${emoji}`}
        >
          <span>{emoji}</span>
          <span className="text-xs text-[#8b949e]">
            {reactions[emoji] || 0}
          </span>
        </button>
      ))}
    </div>
  );
}