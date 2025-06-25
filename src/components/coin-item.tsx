import { fetch } from '@tauri-apps/plugin-http';
import {useEffect, useState} from "react";
import {TrendingDown, TrendingUp} from "lucide-react";
import {Card} from "@/components/ui/card";

interface CoinItemProps {
  id: string
  symbol: string
  name: string
  change24h: number,
  volume: string,
  marketCap: string,
  exchange: string,
  pair: string,
  icon: string,
}
export const CoinItem = ({id,symbol,name,change24h, volume, marketCap,  exchange,pair,icon}: CoinItemProps) => {
  const [price, setPrice] = useState(0)

  async function getPrice() {
    const url = `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USDT`
    const response = await fetch(url, {
      method: 'GET',
    });
    const json: Map<string, number> = await response.json();
    setPrice(json["USDT"])
  }

  useEffect(()=>{
    void getPrice()
  }, []);

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
      <Card className="p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
              {icon}
            </div>
            <div>
              <div className="text-sm text-gray-500">{exchange}</div>
              <div className="font-semibold">
                {symbol}
                <span className="text-gray-400 text-sm">{pair}</span>
              </div>
              <div className="text-xs text-gray-400">{volume}</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold">{formatPrice(price)}</div>
            <div className="text-sm text-gray-500">{marketCap}</div>
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