import React from 'react'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'

const FAQ = () => {
  return (
    <div className="pt-40">
      <SEO 
        title="Frequently Asked Questions"
        description="Find answers to common questions about buying, selling, and renting luxury assets on Otulia."
      />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl canela font-bold mb-8">Frequently Asked Questions</h1>
        <p className="text-gray-500">Coming soon.</p>
      </div>
    </div>
  )
}

export default FAQ
