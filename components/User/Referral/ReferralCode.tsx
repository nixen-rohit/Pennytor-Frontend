"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Link, Share2, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const REFERRAL_CODE = "W0YFGP5T2A"
const LINK_TEXT = `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/register?ref=${REFERRAL_CODE}`

export default function ReferralCode() {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const handleCopy = useCallback(async (text: string, setter: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text)
      setter(true)
      setTimeout(() => setter(false), 2000)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
      setter(true)
      setTimeout(() => setter(false), 2000)
    }
  }, [])

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Your Referral Code</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Share and earn commissions</p>
          </div>
          <Share2 className="h-5 w-5 text-[#E85B66]" />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">L1: 0.5%</span>
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">L2: 0.25%</span>
          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">L3: 0.25%</span>
        </div>

        <div className="relative flex items-center justify-between p-3 rounded-lg bg-white/10 border border-white/10">
          <code className="text-sm font-mono font-bold tracking-wider text-white">
            {REFERRAL_CODE}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(REFERRAL_CODE, setCopiedCode)}
            className={cn(
              "text-xs gap-1.5 transition-all duration-300",
              copiedCode && "text-green-500",
            )}
          >
            <span className="relative">
              <Copy
                className={cn(
                  "h-3.5 w-3.5 transition-all duration-300",
                  copiedCode ? "opacity-0 scale-0" : "opacity-100 scale-100",
                )}
              />
              <Check
                className={cn(
                  "h-3.5 w-3.5 absolute inset-0 transition-all duration-300",
                  copiedCode ? "opacity-100 scale-100" : "opacity-0 scale-0",
                )}
              />
            </span>
            {copiedCode ? "Copied!" : "Copy"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-muted-foreground truncate">
            {LINK_TEXT}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(LINK_TEXT, setCopiedLink)}
            className={cn(
              "text-xs gap-1.5 border-white/20 shrink-0 transition-all duration-300",
              copiedLink && "text-green-500 border-green-500/30",
            )}
          >
            <span className="relative">
              <Link
                className={cn(
                  "h-3.5 w-3.5 transition-all duration-300",
                  copiedLink ? "opacity-0 scale-0" : "opacity-100 scale-100",
                )}
              />
              <Check
                className={cn(
                  "h-3.5 w-3.5 absolute inset-0 transition-all duration-300",
                  copiedLink ? "opacity-100 scale-100" : "opacity-0 scale-0",
                )}
              />
            </span>
            {copiedLink ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
