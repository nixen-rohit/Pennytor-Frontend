"use client"
import { useCallback, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Wallet, TrendingUp } from "lucide-react"
import { DepositService } from "@/services/deposit.service"

const inr = (v: string | number) => `₹${Number(v||0).toLocaleString("en-IN")}`

interface PortfolioState {
  totalInvested: number
  activeInvestments: number
}

export default function PortfolioCard() {
  const [state, setState] = useState< PortfolioState | null>(null)
  const [loading, setLoading] = useState(true)
  const load = async () => {
    setLoading(true)
    try {
      const r = await DepositService.myDeposits()
      const b = Number(r.balance||0)
      const a = r.items?.filter((d:any)=>d.status==="VERIFIED").length||0
      setState({totalInvested: b, activeInvestments: a})
    }catch(e){setState(null)}finally{setLoading(false)}
  }
  useEffect(()=>{const i=setTimeout(()=>void load(),0); return()=>clearTimeout(i)},[load])
  if(loading) return <div className="h-48 flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin"/></div>
  if(!state) return <div className="h-48 border border-white/10 bg-white/5 backdrop-blur-sm p-8 text-center"><p className="text-sm text-muted-foreground">Portfolio data not available</p></div>
  return (
    <Card className="border-white/10 bg-white/5 p-6">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="mb-3">
            <Wallet className="h-4 w-4 text-[#E85B66] mb-2"/>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">TOTAL INVESTED</span>
            <p className="text-lg font-bold text-green-500">{inr(state!.totalInvested)}</p>
          </div>
          <div>
            <TrendingUp className="h-4 w-4 text-green-500 mb-2"/>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">TODAY'S GAIN</span>
            <p className="text-lg font-bold mt-1">+₹5,000</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-4">
          <Button type="button" size="sm" variant="ghost" onClick={()=>window.location.href="/funds/deposite"}>Show More</Button>
        </div>
      </div>
    </Card>
  )
}