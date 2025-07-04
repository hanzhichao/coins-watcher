"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const ALL_SYMBOLS = ["BTC", "ETH", "AAVE", "DOGE", "TRX", "PEPE"];
const PAIRS = ["USDT", "USD", "BTC", "CNY"];

export default function SettingsPage() {
  const router = useRouter();
  const [frequency, setFrequency] = useState(5);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(["BTC"]);
  const [pair, setPair] = useState("USDT");
  const [coinSettings, setCoinSettings] = useState<Record<string, { alert: string; cost: string }>>({
    BTC: { alert: "", cost: "" },
  });

  // 币种多选（单选实现，可扩展为多选）
  const handleSymbolChange = (symbol: string) => {
    if (selectedSymbols.includes(symbol)) {
      setSelectedSymbols(selectedSymbols.filter((s) => s !== symbol));
      const newSettings = { ...coinSettings };
      delete newSettings[symbol];
      setCoinSettings(newSettings);
    } else {
      setSelectedSymbols([...selectedSymbols, symbol]);
      setCoinSettings({ ...coinSettings, [symbol]: { alert: "", cost: "" } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          返回
        </Button>
        <span className="ml-4 text-lg font-bold">设置</span>
      </div>
      <div className="max-w-xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>更新频率</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              min={1}
              value={frequency}
              onChange={e => setFrequency(Number(e.target.value))}
              className="w-32"
              suffix="秒"
            />
            <span className="ml-2 text-gray-500">秒</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>关注币种</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-2">
              {ALL_SYMBOLS.map(symbol => (
                <Button
                  key={symbol}
                  variant={selectedSymbols.includes(symbol) ? "default" : "outline"}
                  onClick={() => handleSymbolChange(symbol)}
                  size="sm"
                >
                  {symbol}
                </Button>
              ))}
            </div>
            {/* 可扩展为搜索和添加新币种 */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>每币提醒价格与成本价</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSymbols.map(symbol => (
              <div key={symbol} className="mb-4 flex items-center gap-2">
                <span className="w-12 inline-block">{symbol}</span>
                <Input
                  placeholder="提醒价格"
                  type="number"
                  value={coinSettings[symbol]?.alert || ""}
                  onChange={e => setCoinSettings({
                    ...coinSettings,
                    [symbol]: { ...coinSettings[symbol], alert: e.target.value }
                  })}
                  className="w-28"
                />
                <Input
                  placeholder="成本价"
                  type="number"
                  value={coinSettings[symbol]?.cost || ""}
                  onChange={e => setCoinSettings({
                    ...coinSettings,
                    [symbol]: { ...coinSettings[symbol], cost: e.target.value }
                  })}
                  className="w-28"
                />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>选择 Pair</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={pair} onValueChange={setPair}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="选择 Pair" />
              </SelectTrigger>
              <SelectContent>
                {PAIRS.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 