import React from 'react';

export default function Zoombox({children}) {
  return (
      <div
        style={{
          position: 'relative', 
          backgroundColor: 'grey',
          display: 'inline-block',
          padding: '7px',
          borderRadius: '2px',
          margin: '0px 5px',
          fontSize: '16px',
          color: 'white',
        }}
        
      >{children}</div>
      
  );
}
