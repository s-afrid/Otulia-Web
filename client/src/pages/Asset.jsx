import React from 'react'
import Navbar from '../components/Navbar'
import Asset_Section from '../components/asset_page/Asset_Section'


const Asset = () => {
  
  return (
    <div className='pt-24'>
      <Navbar />
      <main>
        <Asset_Section />
      </main>
    </div>
  )
}

export default Asset
