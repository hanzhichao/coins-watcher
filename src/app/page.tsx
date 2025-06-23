"use client"

import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Search, Plus, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

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
  },
  {
    id: "cardano",
    symbol: "ADA",
    name: "Cardano",
    price: 0.8934,
    change24h: 3.21,
    volume: "45.7亿",
    marketCap: "≈¥6.04",
    exchange: "Kraken",
    pair: "/USD",
    icon: "₳",
  },
]

export default function Home() {
  const [coins, setCoins] = useState<CoinData[]>(mockCoinData)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    invoke("init");
  }, []);

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

    return () => clearInterval(interval)
  }, [])

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatPrice = (price: number) => {
    if (price < 0.001) {
      return price.toFixed(8)
    } else if (price < 1) {
      return price.toFixed(5)
    } else if (price < 100) {
      return price.toFixed(4)
    } else {
      return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(2)}%`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索币种..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <h1 className="text-xl font-bold text-teal-500 hidden sm:block">币观 Lite</h1>

          <Button variant="ghost" size="icon" className="text-teal-500">
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Price List */}
      <div className="max-w-4xl mx-auto p-4 space-y-2">
        {filteredCoins.map((coin) => (
          <Card key={coin.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                  {coin.icon}
                </div>
                <div>
                  <div className="text-sm text-gray-500">{coin.exchange}</div>
                  <div className="font-semibold">
                    {coin.symbol}
                    <span className="text-gray-400 text-sm">{coin.pair}</span>
                  </div>
                  <div className="text-xs text-gray-400">{coin.volume}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold">{formatPrice(coin.price)}</div>
                <div className="text-sm text-gray-500">{coin.marketCap}</div>
                <div
                  className={`flex items-center justify-end space-x-1 text-sm font-medium ${
                    coin.change24h >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {coin.change24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>{formatChange(coin.change24h)}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/*/!* Chart Section *!/*/}
      {/*<div className="max-w-4xl mx-auto p-4 mt-8">*/}
      {/*  <Card className="p-6">*/}
      {/*    <h3 className="text-lg font-semibold mb-4">市场趋势</h3>*/}
      {/*    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">*/}
      {/*      <svg className="w-full h-full" viewBox="0 0 400 200">*/}
      {/*        <polyline*/}
      {/*          fill="none"*/}
      {/*          stroke="#10b981"*/}
      {/*          strokeWidth="2"*/}
      {/*          points="0,150 50,140 100,120 150,110 200,130 250,100 300,90 350,85 400,80"*/}
      {/*        />*/}
      {/*        <circle cx="400" cy="80" r="4" fill="#10b981" />*/}
      {/*      </svg>*/}
      {/*      <div className="absolute bottom-4 left-4 text-xs text-gray-500">11:01 → 11:01</div>*/}
      {/*      <div className="absolute top-4 left-4 text-sm font-medium">2,300</div>*/}
      {/*      <div className="absolute bottom-12 left-4 text-sm font-medium">2,200</div>*/}
      {/*    </div>*/}
      {/*  </Card>*/}
      {/*</div>*/}

      {/*/!* Add Button for Mobile *!/*/}
      {/*<div className="fixed bottom-6 right-6 lg:hidden">*/}
      {/*  <Button size="lg" className="rounded-full h-14 w-14 bg-teal-500 hover:bg-teal-600">*/}
      {/*    <Plus className="h-6 w-6" />*/}
      {/*  </Button>*/}
      {/*</div>*/}
    </div>
  )
}
