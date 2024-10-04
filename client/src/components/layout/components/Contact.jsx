import React from 'react';
import PhoneIcon from '../../../assets/call.svg'; // Adjust the path accordingly
import EmailIcon from '../../../assets/mail.svg'; // Adjust the path accordingly
import AddressIcon from '../../../assets/map-pin.svg'; // Adjust the path accordingly

const Contact = () => {
  return (
    <div className='flex flex-col'>
      <h1 className='font-bold mb-2'>Contact</h1>
      <ul className='flex flex-col space-y-2 gap-y-1'>
        <li className='flex items-center'>
          <a href="tel:+18966759493" className='flex items-center text-black' target="_blank" rel="noopener noreferrer">
            <img src={PhoneIcon} alt="Phone" className='h-5 w-5 mr-2' />
            (896) 675-9493
          </a>
        </li>
        <li className='flex items-center'>
          <a href="mailto:captianquackerss@gmail.com" className='flex items-center text-black' target="_blank" rel="noopener noreferrer">
            <img src={EmailIcon} alt="Email" className='h-5 w-5 mr-2' />
            captianquackerss@gmail.com
          </a>
        </li>
        <li className='flex items-center'>
          <a href="https://www.google.com/maps?q=43+W.+Wellington+Road+Fairhope,+AL+36532" className='flex items-center text-black' target="_blank" rel="noopener noreferrer">
            <img src={AddressIcon} alt="Address" className='h-5 w-5 mr-2' />
            43 W. Wellington Road Fairhope, AL 36532
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Contact;
