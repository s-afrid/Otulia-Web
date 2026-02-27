import React from 'react'
import SEO from '../../components/SEO'
import Navbar from '../../components/Navbar'

const Reviews = () => {
  return (
    <div className="pt-40">
      <SEO 
        title="Client Reviews"
        description="Read what our elite community members have to say about their experience with Otulia."
      />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-playfair font-bold mb-8">Client Reviews</h1>
        <p className="text-gray-500">Coming soon.</p>
      </div>
    </div>
  )
}

export default Reviews
