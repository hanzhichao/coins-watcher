import { fetch } from '@tauri-apps/plugin-http';
import {useEffect, useState} from "react";
import {TrendingDown, TrendingUp} from "lucide-react";
import {Card} from "@/components/ui/card";

interface CoinItemProps {
  symbol: string
  pair: string,
}
export const CoinItem = ({symbol,pair}: CoinItemProps) => {
  const [price, setPrice] = useState(0)
  const [name, setName] = useState("")
  const [change24h, setChange24h] = useState(0)
  const [volume, setVolume] = useState("")
  const [marketCap, setMarketCap] = useState("")
  const [exchange, setExchange] = useState("Binance")
  const [icon, setIcon] = useState("")

  async function getPrice() {
    const url = `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USDT`
    const response = await fetch(url, {
      method: 'GET',
    });
    const json = await response.json();
    setPrice(json.USDT)
  }

  async function getPrice2() {
    const url = `https://www.binance.com/bapi/asset/v2/public/asset-service/product/get-product-by-symbol?symbol=${symbol}USDT`
    const response = await fetch(url, {
      method: 'GET',
    });
    const json = await response.json();
    const icon: string = json.data.ba   // icon
    const name: string = json.data.an   // name
    const price: string = json.data.c   // 当前价格
    const highest_price_24h: string = json.data.h  // 24小时最高价
    const lowest_price_24h: string = json.data.l // 24小时最低价
    const base_price: string = json.data.o  // 基础价格  涨幅 = ( c - o ) / o * 100
    const volume: string = parseFloat(json.data.v).toFixed(4)  // 24 小时成交量(ETH)
    const volume_usdt: string = (parseFloat(json.data.qv) / 100000000).toFixed(4)  // 24 小时成交额(USDT)
    const change24h = (parseFloat(price) - parseFloat(base_price)) / parseFloat(base_price) * 100
    const _marketCap = (parseFloat(price) * 7.17).toFixed(4)

    setPrice(parseFloat(price))
    setIcon(icon)
    setName(name)
    setVolume(volume_usdt.toString())
    setChange24h(change24h)
    setMarketCap(`${lowest_price_24h}~${highest_price_24h}`)
  }

  useEffect(()=>{
    const intervalId = setInterval(() => {
      void getPrice2()
    }, 3000);

    return () => clearInterval(intervalId); // 清除定时器
  }, []);

  // const formatPrice = (price: number) => {
  //   if (price < 0.001) {
  //     return price.toFixed(8)
  //   } else if (price < 1) {
  //     return price.toFixed(5)
  //   } else if (price < 100) {
  //     return price.toFixed(4)
  //   } else {
  //     return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  //   }
  // }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(2)}%`
  }


  return (
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/*<div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">*/}
            {/*  {icon}*/}
            {/*</div>*/}
            <div>
              <div className="text-sm text-gray-500">{name}</div>
              <div className="font-semibold">
                {symbol}
                <span className="text-gray-400 text-sm">{pair}</span>
              </div>
              <div className="text-xs text-gray-400">{marketCap}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold">{price}</div>
            <div className="text-xs text-gray-500">{volume}亿 USDT</div>
            <div
              className={`flex items-center justify-end space-x-1 text-sm font-medium ${
                change24h >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {change24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{formatChange(change24h)}</span>
            </div>
          </div>
        </div>
      </Card>
  )

}