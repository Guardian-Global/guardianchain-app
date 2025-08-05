import React from 'react';
import useSWR from 'swr';
import { Calendar, Clock } from 'lucide-react';

interface EngagementHeatmapProps {
  capsuleId: string;
}

export default function EngagementHeatmap({ capsuleId }: EngagementHeatmapProps) {
  const { data: heatmapData, isLoading } = useSWR(`/api/capsule/analytics/heatmap/${capsuleId}`);

  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-[#8b949e]">
        <Clock className="h-6 w-6 animate-spin mr-2" />
        Loading heatmap data...
      </div>
    );
  }

  if (!heatmapData || heatmapData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[#8b949e]">
        <Calendar className="h-6 w-6 mr-2" />
        No time-based interaction data available
      </div>
    );
  }

  // Find max interactions for normalization
  const maxInteractions = Math.max(...heatmapData.map((d: any) => parseInt(d.interactions)));

  // Create data matrix
  const getIntensity = (day: number, hour: number) => {
    const entry = heatmapData.find((d: any) => 
      parseInt(d.day_of_week) === day && parseInt(d.hour) === hour
    );
    return entry ? parseInt(entry.interactions) : 0;
  };

  const getOpacity = (interactions: number) => {
    if (maxInteractions === 0) return 0;
    return Math.max(0.1, interactions / maxInteractions);
  };

  const getColor = (interactions: number) => {
    const opacity = getOpacity(interactions);
    if (opacity > 0.7) return 'rgba(255, 0, 212, ' + opacity + ')'; // Hot pink for high activity
    if (opacity > 0.4) return 'rgba(0, 255, 225, ' + opacity + ')'; // Cyan for medium activity
    return 'rgba(139, 148, 158, ' + (opacity * 0.5) + ')'; // Gray for low activity
  };

  return (
    <div className="bg-[#0d1117] p-6 rounded-xl text-[#f0f6fc]">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-[#00ffe1]" />
        <h3 className="text-xl font-bold text-[#00ffe1]">Engagement Heatmap</h3>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Hour labels */}
          <div className="flex mb-2">
            <div className="w-12"></div> {/* Space for day labels */}
            {hours.map((hour, i) => (
              <div 
                key={hour} 
                className="flex-1 text-center text-xs text-[#8b949e] px-1"
                style={{ minWidth: '30px' }}
              >
                {i % 4 === 0 ? hour : ''}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {days.map((day, dayIndex) => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-12 text-xs text-[#8b949e] font-medium">
                {day}
              </div>
              {hours.map((hour, hourIndex) => {
                const interactions = getIntensity(dayIndex, hourIndex);
                const color = getColor(interactions);
                
                return (
                  <div
                    key={`${day}-${hour}`}
                    className="flex-1 h-6 mx-0.5 rounded-sm border border-[#30363d] cursor-pointer transition-all duration-200 hover:scale-110"
                    style={{ 
                      backgroundColor: color,
                      minWidth: '28px'
                    }}
                    title={`${day} ${hour}: ${interactions} interactions`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-600 opacity-30"></div>
            <span className="text-[#8b949e]">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-[#00ffe1] opacity-60"></div>
            <span className="text-[#8b949e]">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-[#ff00d4]"></div>
            <span className="text-[#8b949e]">High</span>
          </div>
        </div>
        <span className="text-[#8b949e]">Peak activity: {maxInteractions} interactions</span>
      </div>
    </div>
  );
}