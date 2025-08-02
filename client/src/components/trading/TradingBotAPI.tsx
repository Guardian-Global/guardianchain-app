import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot,
  Code,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Copy,
  Check,
} from "lucide-react";

export function TradingBotAPI() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const restAPIExample = `// GTT Trading Bot API - REST Integration
const API_BASE = 'https://api.guardianchain.io/v1';
const API_KEY = 'your_api_key_here';

// Get real-time GTT price and market data
async function getMarketData() {
  const response = await fetch(\`\${API_BASE}/market/gtt\`, {
    headers: { 'Authorization': \`Bearer \${API_KEY}\` }
  });
  return response.json();
}

// Execute buy/sell orders
async function executeOrder(type, amount, price) {
  const response = await fetch(\`\${API_BASE}/orders\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      symbol: 'GTT/USDT',
      side: type, // 'buy' or 'sell'
      amount: amount,
      price: price,
      type: 'limit'
    })
  });
  return response.json();
}

// Get order book depth
async function getOrderBook() {
  const response = await fetch(\`\${API_BASE}/orderbook/gtt\`, {
    headers: { 'Authorization': \`Bearer \${API_KEY}\` }
  });
  return response.json();
}`;

  const websocketExample = `// GTT WebSocket Trading Feed
const ws = new WebSocket('wss://api.guardianchain.io/ws');

ws.onopen = () => {
  // Subscribe to real-time GTT data
  ws.send(JSON.stringify({
    id: 1,
    method: 'SUBSCRIBE',
    params: [
      'gtt@ticker',        // Price updates
      'gtt@depth',         // Order book changes
      'gtt@trade',         // Recent trades
      'gtt@whale_alert'    // Large transactions
    ]
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.stream) {
    case 'gtt@ticker':
      updatePrice(data.data.price);
      break;
    case 'gtt@whale_alert':
      handleWhaleActivity(data.data);
      break;
    case 'gtt@trade':
      updateRecentTrades(data.data);
      break;
  }
};`;

  const pythonExample = `# GTT Python Trading Bot
import requests
import websocket
import json
import threading

class GTTTradingBot:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://api.guardianchain.io/v1'
        self.ws_url = 'wss://api.guardianchain.io/ws'
        
    def get_headers(self):
        return {'Authorization': f'Bearer {self.api_key}'}
    
    def get_market_data(self):
        response = requests.get(
            f'{self.base_url}/market/gtt',
            headers=self.get_headers()
        )
        return response.json()
    
    def place_order(self, side, amount, price):
        payload = {
            'symbol': 'GTT/USDT',
            'side': side,
            'amount': amount,
            'price': price,
            'type': 'limit'
        }
        response = requests.post(
            f'{self.base_url}/orders',
            headers=self.get_headers(),
            json=payload
        )
        return response.json()
    
    def start_websocket(self):
        def on_message(ws, message):
            data = json.loads(message)
            self.handle_market_update(data)
            
        def on_open(ws):
            subscribe_msg = {
                'id': 1,
                'method': 'SUBSCRIBE',
                'params': ['gtt@ticker', 'gtt@whale_alert']
            }
            ws.send(json.dumps(subscribe_msg))
        
        ws = websocket.WebSocketApp(
            self.ws_url,
            on_message=on_message,
            on_open=on_open
        )
        ws.run_forever()`;

  const apiEndpoints = [
    {
      method: "GET",
      endpoint: "/market/gtt",
      description: "Real-time GTT price, volume, and market data",
      rateLimit: "10/second",
    },
    {
      method: "GET",
      endpoint: "/orderbook/gtt",
      description: "Order book depth with bid/ask levels",
      rateLimit: "5/second",
    },
    {
      method: "POST",
      endpoint: "/orders",
      description: "Place buy/sell orders",
      rateLimit: "100/minute",
    },
    {
      method: "GET",
      endpoint: "/orders/history",
      description: "Order history and trade execution data",
      rateLimit: "10/minute",
    },
    {
      method: "GET",
      endpoint: "/whale/alerts",
      description: "Large transaction alerts and whale activity",
      rateLimit: "20/minute",
    },
    {
      method: "GET",
      endpoint: "/analytics/momentum",
      description: "Market momentum and sentiment indicators",
      rateLimit: "5/minute",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bot className="h-5 w-5 text-blue-400" />
            Trading Bot API Integration
            <Badge
              variant="outline"
              className="text-green-400 border-green-400"
            >
              ENTERPRISE
            </Badge>
          </CardTitle>
          <p className="text-slate-400">
            High-performance APIs for algorithmic trading, market making, and
            automated strategies
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-slate-800 rounded-lg text-center">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-white font-medium">Sub-millisecond</div>
              <div className="text-sm text-slate-400">Latency</div>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg text-center">
              <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-white font-medium">99.99%</div>
              <div className="text-sm text-slate-400">Uptime SLA</div>
            </div>
            <div className="p-4 bg-slate-800 rounded-lg text-center">
              <Globe className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-white font-medium">50+</div>
              <div className="text-sm text-slate-400">Global Endpoints</div>
            </div>
          </div>

          <Tabs defaultValue="rest" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="rest">REST API</TabsTrigger>
              <TabsTrigger value="websocket">WebSocket</TabsTrigger>
              <TabsTrigger value="python">Python SDK</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            </TabsList>

            <TabsContent value="rest" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">
                    REST API Integration
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(restAPIExample, "rest")}
                    className="flex items-center gap-2"
                  >
                    {copiedCode === "rest" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy Code
                  </Button>
                </div>
                <pre className="bg-slate-800 p-4 rounded-lg text-sm text-green-400 overflow-x-auto">
                  <code>{restAPIExample}</code>
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="websocket" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">
                    Real-time WebSocket Feed
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(websocketExample, "websocket")
                    }
                    className="flex items-center gap-2"
                  >
                    {copiedCode === "websocket" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy Code
                  </Button>
                </div>
                <pre className="bg-slate-800 p-4 rounded-lg text-sm text-blue-400 overflow-x-auto">
                  <code>{websocketExample}</code>
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="python" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">
                    Python Trading Bot
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(pythonExample, "python")}
                    className="flex items-center gap-2"
                  >
                    {copiedCode === "python" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy Code
                  </Button>
                </div>
                <pre className="bg-slate-800 p-4 rounded-lg text-sm text-purple-400 overflow-x-auto">
                  <code>{pythonExample}</code>
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="endpoints" className="mt-4">
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-white mb-4">
                  Available API Endpoints
                </h3>
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="p-4 bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            endpoint.method === "GET" ? "default" : "secondary"
                          }
                        >
                          {endpoint.method}
                        </Badge>
                        <code className="text-blue-400 font-mono">
                          {endpoint.endpoint}
                        </code>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {endpoint.rateLimit}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm">
                      {endpoint.description}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <span className="text-blue-400 font-medium">Get API Access</span>
            </div>
            <p className="text-sm text-slate-300 mb-3">
              Enterprise API access includes advanced features like smart order
              routing, cross-exchange arbitrage, and institutional-grade market
              data.
            </p>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Enter your email for API access"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-slate-800 border-slate-700"
              />
              <Button>Request Access</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
