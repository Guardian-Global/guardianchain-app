import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Terminal, Activity, Clock } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  event: string;
  level: 'info' | 'warn' | 'error' | 'success';
  nodeId?: string;
}

export default function NodeLogStream() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate real-time log stream with WebSocket or Server-Sent Events
    const eventSource = new EventSource('/api/logs/stream');
    
    eventSource.onopen = () => {
      setIsConnected(true);
    };
    
    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setLogs((prev) => [parsed, ...prev.slice(0, 99)]);
      } catch (error) {
        console.error('Failed to parse log entry:', error);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    // Fallback: Generate demo logs if no real stream
    const fallbackInterval = setInterval(() => {
      const demoLogs = [
        { event: 'Capsule verification completed', level: 'success' as const, nodeId: 'node-001' },
        { event: 'GTT token distribution processed', level: 'info' as const, nodeId: 'node-002' },
        { event: 'Truth validation in progress', level: 'info' as const, nodeId: 'node-003' },
        { event: 'Veritas seal generated', level: 'success' as const, nodeId: 'node-001' },
        { event: 'Network consensus reached', level: 'info' as const, nodeId: 'node-004' },
      ];
      
      const randomLog = demoLogs[Math.floor(Math.random() * demoLogs.length)];
      const logEntry: LogEntry = {
        ...randomLog,
        timestamp: new Date().toISOString(),
      };
      
      setLogs((prev) => [logEntry, ...prev.slice(0, 99)]);
    }, 5000);

    return () => {
      eventSource.close();
      clearInterval(fallbackInterval);
    };
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success': return 'bg-green-600';
      case 'warn': return 'bg-yellow-600';
      case 'error': return 'bg-red-600';
      default: return 'bg-blue-600';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success': return '✓';
      case 'warn': return '⚠';
      case 'error': return '✗';
      default: return '•';
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-700 font-mono">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-white">
            <Terminal className="w-5 h-5 mr-2 text-green-400" />
            Veritas Node Stream
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge 
              className={`${isConnected ? 'bg-green-600' : 'bg-red-600'} text-white`}
            >
              <Activity className="w-3 h-3 mr-1" />
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="bg-black rounded-lg p-4 h-[300px] overflow-y-auto scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600">
          {logs.length === 0 ? (
            <div className="text-slate-500 text-center py-8">
              <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Waiting for node activity...</p>
            </div>
          ) : (
            <ul className="text-xs space-y-2">
              {logs.map((log, i) => (
                <li key={i} className="flex items-start space-x-3 text-green-400">
                  <span className={`inline-block w-4 h-4 rounded-full text-xs flex items-center justify-center text-white ${getLevelColor(log.level)}`}>
                    {getLevelIcon(log.level)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className="text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      {log.nodeId && (
                        <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                          {log.nodeId}
                        </Badge>
                      )}
                    </div>
                    <p className="text-green-300 mt-1">{log.event}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}