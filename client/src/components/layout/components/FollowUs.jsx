import React from 'react'
import SocialMediaIcons from './SocialMediaIcons'


const FollowUs = () => {
  return (
    <div className='flex flex-col max-w-[20rem]'>
    <h1 className='font-bold mb-2'>Pack N' Quack</h1>
    <p className='text-gray-500 text-sm'>Join the Quack Gang and stay in the loop for the latest travel updates, exciting destinations, 
        and unforgettable, comfortable trips. Whether you're a seasoned 
        traveler or just starting, enjoy great deals, 
        insider tips, and adventure with us!
    </p>
    <SocialMediaIcons />
    
</div>
  )
}

export default FollowUs