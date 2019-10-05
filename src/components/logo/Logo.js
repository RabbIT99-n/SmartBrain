import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
    return (
       <div className='ma4 mt0'>
            <Tilt className="Tilt" options={{ max : 60 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner pa3"> 
                    <img src={brain} alt='logo' style={{paddingTop: '7px'}} height ='90px' />
                </div>
            </Tilt>
       </div>
    );
}

export default Logo;