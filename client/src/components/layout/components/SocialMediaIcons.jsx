import React from 'react';
import InstagramIcon from '../../../assets/Instagram.svg';
import FacebookIcon from '../../../assets/Facebook.svg';
import TwitterIcon from '../../../assets/Twitter.svg';
import YouTubeIcon from '../../../assets/Youtube.svg';

const SocialMediaIcons = () => {
  return (
    <div className="flex space-x-4 mt-3 ">
      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
        <img src={InstagramIcon} alt="Instagram" className="h-8 w-8" />
      </a>
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
        <img src={FacebookIcon} alt="Facebook" className="h-8 w-8" />
      </a>
      <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
        <img src={TwitterIcon} alt="Twitter" className="h-8 w-8" />
      </a>
      <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
        <img src={YouTubeIcon} alt="YouTube" className="h-8 w-8" />
      </a>
    </div>
  );
};

export default SocialMediaIcons;
