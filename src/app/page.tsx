"use client"

import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react"
import { Search, Plus, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {CoinItem} from "@/components/coin-item";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';


interface CoinData {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  volume: string
  marketCap: string
  exchange: string
  pair: string
  icon: string
}

const mockCoinData: CoinData[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    price: 101146.38,
    change24h: 1.29,
    volume: "191.46亿CNY",
    marketCap: "≈¥727,564.38",
    exchange: "Binance",
    pair: "/USDT",
    icon: "₿",
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    price: 2239.79,
    change24h: 1.41,
    volume: "115.1亿",
    marketCap: "≈¥16,111.22",
    exchange: "Binance",
    pair: "/USDT",
    icon: "Ξ",
  },
  {
    id: "aave",
    symbol: "AAVE",
    name: "Aave",
    price: 229.0772,
    change24h: 1.58,
    volume: "1.22亿",
    marketCap: "≈¥1,647.79",
    exchange: "Huobi",
    pair: "/USDT",
    icon: "🅰",
  },
  {
    id: "dogecoin",
    symbol: "DOGE",
    name: "Dogecoin",
    price: 0.15222,
    change24h: 1.55,
    volume: "18.07亿",
    marketCap: "≈¥1.09",
    exchange: "Binance",
    pair: "/USDT",
    icon: "Ð",
  },
  {
    id: "tron",
    symbol: "TRX",
    name: "Tron",
    price: 0.2659,
    change24h: 2.17,
    volume: "3,490.23万",
    marketCap: "≈¥1.91",
    exchange: "Kucoin",
    pair: "/USDT",
    icon: "⚡",
  },
  {
    id: "pepe",
    symbol: "PEPE",
    name: "Pepe",
    price: 0.00000886,
    change24h: 4.63,
    volume: "16.03亿",
    marketCap: "≈¥0.00006373",
    exchange: "Binance",
    pair: "/USDT",
    icon: "🐸",
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    price: 198.45,
    change24h: -2.34,
    volume: "89.2亿",
    marketCap: "≈¥1,342.18",
    exchange: "Binance",
    pair: "/USDT",
    icon: "◎",
  }
]

export default function Home() {
  const [coins, setCoins] = useState<CoinData[]>(mockCoinData)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
          sendNotification({ title: 'Tauri', body: 'Tauri is awesome ---------- !' });
        }
      }

  // useEffect(() => {
  //   void sendMsg();
  // }, []);



  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prevCoins) =>
        prevCoins.map((coin) => ({
          ...coin,
          price: coin.price * (1 + (Math.random() - 0.5) * 0.02),
          change24h: coin.change24h + (Math.random() - 0.5) * 0.5,
        })),
      )
    }, 5000)

    return () => { clearInterval(interval); }
  }, [])

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
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
                onChange={(e) => { setSearchTerm(e.target.value); }}
                className=""
              />
            </div>
          </div>

          {/*<h1 className="text-xl font-bold text-teal-500 hidden sm:block">币观 Lite</h1>*/}

          <Button variant="ghost" size="icon" className="text-teal-500" onClick={() => {void sendMsg()}}>
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Price List */}
      <div className="max-w-4xl mx-auto p-4 space-y-2">
        {filteredCoins.map((coin) => (
          <CoinItem key={coin.id} id={coin.id} symbol={coin.symbol} name={coin.name} change24h={coin.change24h} volume={coin.volume} marketCap={coin.marketCap} exchange={coin.exchange} pair={coin.pair} icon={coin.icon} />
        ))}
      </div>
    </div>
  )
}
