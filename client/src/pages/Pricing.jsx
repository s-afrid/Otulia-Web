import React from 'react'
import Navbar from '../components/Navbar'
import PricingSection from '../components/pricing_page/Pricing_Section'
import SEO from '../components/SEO'

const Pricing = () => {
  return (
    <div className='pt-24'>
      <SEO title="Pricing Plans" description="Choose the perfect plan for your luxury asset business. Scale your global reach with Otulia." />
      <Navbar hideSearch={true} />
      <PricingSection />
    </div>
  )
}

export default Pricing
