import React from 'react'
import DealHeader from '../components/HotDeals/DealHeader'
import TrendingProducts from '../components/home/TrendingProducts'
import NewsletterBanner from './NewsletterBanner'

export default function HotDeals() {
  return (
    <div>
      <DealHeader/>
      <TrendingProducts/>
      <NewsletterBanner/>
    </div>
  )
}
