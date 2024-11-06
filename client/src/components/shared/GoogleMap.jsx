import React from 'react';

// const GoogleMap = (props) => {
export default function GoogleMap(props) {
  return (
    <div className='w-96 h-96 p-2 ' >
      <iframe className='w-[28rem] h-96 border-0 ' src={props.src}
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">

      </iframe>
    </div>
  );
};

// export default GoogleMap(props);
