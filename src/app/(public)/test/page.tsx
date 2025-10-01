import ShopComponent from '@/components/ShopComponent'
import React from 'react'

const Testpage = () => {
  return (
    <div>
        <h1 className='text-3xl font-bold underline'>Test Page</h1>
        <p>This is a test page to verify routing and component rendering.</p>
        <ShopComponent />
    </div>
  )
}

export default Testpage
