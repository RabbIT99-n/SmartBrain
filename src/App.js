import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

import './App.css';

import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import Rank from './components/rank/Rank';
import SignIn from './components/signin/SignIn';
import Register from './components/register/Register';
import Credits from './components/credits/Credits';
import FaceRecognition from './components/facerecognition/FaceRecognition';

const app = new Clarifai.App({
  apiKey: '83a9751906f4436780758793c4f09c4d'
});

const particlesOptions ={
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
   
  }
}

class App extends Component {
  constructor () {
    super();
    this.state= {
      input: '',
      imageURL: '',
      box: [],
      route: 'signin'
    }
  }

  calculateFaceLocation = (data) => {
    const image=document.getElementById('input image');
    const width= Number(image.width);
    const height= Number (image.height);
    const clarifaiFaces=data.outputs[0].data.regions;
    const boxes= clarifaiFaces.map(
      face => (
        { leftCol: face.region_info.bounding_box.left_col*width,
          topRow: face.region_info.bounding_box.top_row*height,
          rightCol: width - (face.region_info.bounding_box.right_col*width),
          bottomRow: height- (face.region_info.bounding_box.bottom_row*height)
        }
      )
    );
    return boxes;
  }
  displayFaceBox = (box) => {
    this.setState ({box: box});
   }
  onRouteChange = (route)=> {
    this.setState({route: route});
  }
  onInputChange = (event) => {
    this.setState({ input: event.target.value});
  }
  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    app.models.predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
        .then( response => this.displayFaceBox(this.calculateFaceLocation(response)))
        .catch (err => console.log(err));
    
   }
  render() {  
    var renderIt=null;
    if (this.state.route ==='home' && this.state.imageURL!=='') {
      renderIt =
      <div>
        <Logo/> 
        <Rank/>
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition imageURL={this.state.imageURL} box={this.state.box}/> 
        <Credits/>
      </div> 
    }
    else if (this.state.route ==='home' && this.state.imageURL==='') {
      renderIt =
      <div>
        <Logo/> 
        <Rank/>
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <Credits/>
      </div> 
    }
    else if (this.state.route ==='signin') {
      renderIt =
              <SignIn onRouteChange={this.onRouteChange}/>
    }
    else {
      renderIt = 
              <Register onRouteChange={this.onRouteChange}/>
     }

    return (
      <div className="App">
        <Particles params={particlesOptions} className='particles'/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.route==='home'}/>
        {renderIt}
      </div>
    );
 
  }
}

export default App;
