import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageURL, box}) => {
    const faces = box.map((oneBox, i) =>
    <div className='bounding-box' key={i} style={{top: oneBox.topRow, right: oneBox.rightCol, bottom: oneBox.bottomRow, left:oneBox.leftCol}}></div>
    );
    return (
       <div className='center ma'>
           <div className='absolute mt2'>
            <img src={imageURL} id='input image' alt='face_recognized' width='500px' height='auto'/>
            {faces}
            </div>
       </div>
    );
}

export default FaceRecognition;