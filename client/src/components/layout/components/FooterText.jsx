import React from 'react'
import FollowUs from './FollowUs'
import Destinations from './Destinations'
import UsefulLinks from './UsefulLinks'
import Contact from './Contact'



const FooterText = () => {
  return (
    <div className='flex flex-row gap-10 sp justify-between py-8 px-40'>
        <FollowUs />
        <Destinations />
        <UsefulLinks />
        <Contact />
    </div>
  )
}

export default FooterText