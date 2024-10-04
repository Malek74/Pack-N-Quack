import React, { useState } from 'react';
import BlurredImage from './BlurredImage';
import checkIcon from '../../assets/check.svg'
import highlights from "../../assets/itineraryHighlights.svg"
import { Button } from '@/components/ui/button';

const ItineraryCard = (props) => {
  return (
    <div className= {`flex w-full justify-between pe-14 ${props.direction}`}> {/* Make the card fill the full width */}
      <div className='flex flex-col w-1/2 justify-between'> {/* Left side for text, taking 50% width */}
        <h1 className='text-xl font-bold mb-4'>{props.title}</h1>
        <p className='text-gray-500 text-sm mb-5'>{props.description}</p>
        <ul className='list-disc mb-4'>
          <li className='flex items-center'><img src={checkIcon} alt="icon" style={{ width: '20px', height: '20px', marginRight: '10px' }}></img>{props.point1}</li>
          <li className='flex items-center'><img src={checkIcon} alt="icon" style={{ width: '20px', height: '20px', marginRight: '10px' }}></img>{props.point2}</li>
          <li className='flex items-center'><img src={checkIcon} alt="icon" style={{ width: '20px', height: '20px', marginRight: '10px' }}></img>{props.point3}</li>
          <li className='flex items-center bg-red-500 text-green-200'>{props.language}</li>
        </ul>
        <img
        src={highlights}
        alt="Highlights"
        style={{ width: '312px', height: 'auto' ,marginLeft: '-16px'}}
       />
       
       <div className='flex flex-row gap-4'>
        <Button className = "w-1/5 h-12">
          View Details
        </Button>
        <Button 
          onClick={ props.onUpdate} 
          className = "w-1/5 h-12 bg-green-500 hover:bg-green-400"
        >
          Update
        </Button>
        <Button 
          onClick={ props.onDelete} 
          variant = 'destructive'
          className = "w-1/5 h-12"
        >
          Delete
        </Button>
       </div>

       
      </div>
      <div> {/* Right side for the image, taking 50% width */}
        <BlurredImage price={ props.price} />
      </div>
    </div>
  );
}

export default ItineraryCard;
