"use client"

import {invoke} from "@tauri-apps/api/core";
import {useState, useEffect} from "react"
import {Search, Plus, Menu} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {CoinItem} from "@/components/coin-item";
import {Store, load as loadStore } from '@tauri-apps/plugin-store';

import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';




export default function Home() {
  const [coins, setCoins] = useState<string[]>(["BTC","ETH","AAVE","DOGE","TRX","PEPE"])
  const [searchTerm, setSearchTerm] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [pair, setPair] = useState("/USDT")

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
