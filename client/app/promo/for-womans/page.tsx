'use client'

import { PromoBgRightSlide } from "../components/PromoBgRightSlide"
import { PromoHeader } from "../components/PromoHeader"
import { PromoHero } from "../components/PromoHero"
import { PromoNext } from "../components/PromoNext"
import { profiles } from "../data/mens"

export default function PromoForMens() {
  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-hidden">
      <PromoBgRightSlide />
      <PromoHeader />
      <PromoHero profiles={profiles} sex="female" />
      <PromoNext sex="female" />
    </div>
  )
}