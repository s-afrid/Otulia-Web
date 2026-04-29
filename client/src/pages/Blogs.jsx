import React from 'react'
import SEO from '../components/SEO'
import Navbar from '../components/Navbar'

const Blogs = () => {
  return (
    <div className="pt-24">
      <SEO 
        title="Luxury Lifestyle Blogs"
        description="Stay updated with the latest trends in luxury cars, yachts, real estate, and lifestyle."
      />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl canela font-bold mb-8">Luxury Lifestyle Blogs</h1>
        <p className="text-gray-500">Stay tuned for curated insights from the world of luxury.</p>
      </div>
    </div>
  )
}

export default Blogs
