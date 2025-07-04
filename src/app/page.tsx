"use client"

import {invoke} from "@tauri-apps/api/core";
import {useState, useEffect} from "react"
import {Search, Plus, Menu, Settings} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {CoinItem} from "@/components/coin-item";
import {Store, load as loadStore } from '@tauri-apps/plugin-store';
import { useRouter } from "next/navigation";

import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';

import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
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

export default function Home() {
  const [coins, setCoins] = useState<string[]>(["BTC","ETH","AAVE","DOGE","TRX","PEPE"])
  const [searchTerm, setSearchTerm] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [pair, setPair] = useState("/USDT")
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [frequency, setFrequency] = useState(5);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(["BTC"]);
  const [pairSetting, setPairSetting] = useState("USDT");
  const [coinSettings, setCoinSettings] = useState<Record<string, { alert: string; cost: string }>>({
    BTC: { alert: "", cost: "" },
  });

  useEffect(() => {
    void invoke("init");
  }, []);

  const sendMsg = async () => {
    console.log("send msg")
    // 你有发送通知的权限吗？
    let permissionGranted = await isPermissionGranted();

    // 如果没有，我们需要请求它
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }

    // 一旦获得许可，我们就可以发送通知
    if (permissionGranted) {
      sendNotification({title: 'Tauri', body: 'Tauri is awesome ---------- !'});
    }
  }

  const storeKey = async () => {
    // Store 会在 JavaScript 绑定时自动加载。
    const store = await Store.load('store.json');;

    // 设置一个值。
    await store.set('some-key', 5);

    // 获取一个值。
    const val = await store.get('some-key');
    console.log(val); // { value: 5 }

    // 您可以在进行更改后手动保存存储
    // 否则如上所述，它将在正常退出时保存。
    await store.save();
  }

  useEffect(() => {
    void storeKey();
  }, []);


  // Simulate real-time price updates
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCoins((prevCoins) =>
  //       prevCoins.map((coin) => ({
  //         ...coin,
  //         price: coin.price * (1 + (Math.random() - 0.5) * 0.02),
  //         change24h: coin.change24h + (Math.random() - 0.5) * 0.5,
  //       })),
  //     )
  //   }, 5000)
  //
  //   return () => {
  //     clearInterval(interval);
  //   }
  // }, [])

  const filteredCoins = coins.filter(
    (coin) =>
      coin.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          {/*<Button variant="ghost" size="icon" onClick={() => { setIsMenuOpen(!isMenuOpen); }} className="lg:hidden">*/}
          {/*  <Menu className="h-6 w-6" />*/}
          {/*</Button>*/}

          <div className="flex-1 max-w-md mx-1">
            <div className="relative">
              <Input
                placeholder="搜索币种..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className=""
              />
            </div>
          </div>

          {/*<h1 className="text-xl font-bold text-teal-500 hidden sm:block">币观 Lite</h1>*/}

          <Button variant="ghost" size="icon" className="text-teal-500" onClick={() => {
            void sendMsg()
          }}>
            <Plus className="h-6 w-6"/>
          </Button>
          <Drawer open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Settings className="h-6 w-6" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="px-5 w-full pb-10">
              <DrawerTitle className="text-lg mb-4">设置</DrawerTitle>
              <div className="space-y-5">
                <div>
                  <div className="font-semibold mb-2">更新频率</div>
                  <Input
                    type="number"
                    min={1}
                    value={frequency}
                    onChange={e => setFrequency(Number(e.target.value))}
                    className="w-32 inline-block"
                  />
                  <span className="ml-2 text-gray-500">秒</span>
                </div>
                <div>
                  <div className="font-semibold mb-2">关注币种</div>
                  <MultiSelect
                    options={ALL_SYMBOLS}
                    values={selectedSymbols}
                    onChange={symbols => {
                      setSelectedSymbols(symbols);
                      // 自动同步 coinSettings
                      const newSettings = { ...coinSettings };
                      for (const s of Object.keys(newSettings)) {
                        if (!symbols.includes(s)) delete newSettings[s];
                      }
                      for (const s of symbols) {
                        if (!newSettings[s]) newSettings[s] = { alert: "", cost: "" };
                      }
                      setCoinSettings(newSettings);
                    }}
                  />
                </div>
                <div>
                  <div className="font-semibold mb-2">每币提醒价格与成本价</div>
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
                </div>
                <div>
                  <div className="font-semibold mb-2">选择 Pair</div>
                  <Select value={pairSetting} onValueChange={setPairSetting}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="选择 Pair" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAIRS.map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* Price List */}
      <div className="max-w-4xl mx-auto p-4 space-y-2">
        {filteredCoins.map((coin, index) => (
          <CoinItem symbol={coin} pair={pair}/>
        ))}
      </div>
    </div>
  )
}

function MultiSelect({ options, values, onChange }: { options: string[]; values: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="relative">
      <div
        className="border rounded-md px-3 py-2 min-h-9 flex flex-wrap gap-2 cursor-pointer bg-background"
        onClick={() => setOpen(v => !v)}
      >
        {values.length === 0 && <span className="text-muted-foreground">请选择币种</span>}
        {values.map(v => (
          <span key={v} className="bg-primary text-primary-foreground rounded px-2 text-xs flex items-center">
            {v}
            <button
              className="ml-1 text-xs"
              onClick={e => {
                e.stopPropagation();
                onChange(values.filter(s => s !== v));
              }}
            >×</button>
          </span>
        ))}
      </div>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-popover border rounded shadow p-2 max-h-48 overflow-y-auto">
          <input
            className="w-full mb-2 px-2 py-1 border rounded text-sm"
            placeholder="搜索币种"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClick={e => e.stopPropagation()}
          />
          {filtered.length === 0 && <div className="text-muted-foreground text-sm">无匹配</div>}
          {filtered.map(opt => (
            <div
              key={opt}
              className={`px-2 py-1 rounded cursor-pointer hover:bg-accent ${values.includes(opt) ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={e => {
                e.stopPropagation();
                if (values.includes(opt)) {
                  onChange(values.filter(s => s !== opt));
                } else {
                  onChange([...values, opt]);
                }
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
