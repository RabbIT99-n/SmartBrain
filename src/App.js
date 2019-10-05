import React, {Component} from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import Rank from './components/rank/Rank';
import SignIn from './components/signin/SignIn';
import Register from './components/register/Register';
import FaceRecognition from './components/facerecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

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
      box: {},
      route: 'signin'
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image=document.getElementById('input image');
    const width= Number(image.width);
    const height= Number (image.height);
    return {
      leftCol: clarifaiFace.left_col*width,
      topRow: clarifaiFace.top_row*height,
      rightCol: width - (clarifaiFace.right_col*width),
      bottomRow: height- (clarifaiFace.bottom_row*height)

    };
  }
  displayFaceBox = (box) => {
    console.log(box);
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
    return (
      <div className="App">
        <Particles params={particlesOptions} className='particles'/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.route==='home'}/>
        { this.state.route ==='home' ?
         <div>
            <Logo/> 
            <Rank/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition imageURL={this.state.imageURL} box={this.state.box}/> 
        </div> 
        : (
          this.state.route ==='signin' ?
          <SignIn onRouteChange={this.onRouteChange}/>
          :<Register onRouteChange={this.onRouteChange}/>
        )
        }
      </div>
    );
  }
}

export default App;
