import React, {Component} from 'react';
import Particles from 'react-particles-js';
import './App.css';

import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import Rank from './components/rank/Rank';
import SignIn from './components/signin/SignIn';
import Register from './components/register/Register';
import Credits from './components/credits/Credits';
import FaceRecognition from './components/facerecognition/FaceRecognition';



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

const initialState={
  input: '',
  imageURL: '',
  box: [],
  route: 'signin',
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
        
  }

}
class App extends Component {
  constructor () {
    super();
    this.state= initialState;
  }

loadUser = (data) => {
  this.setState( {user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
  }})
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
    if (route ==='signin') {
      this.setState(initialState);
    }
  }
  onInputChange = (event) => {
    this.setState({ input: event.target.value});
  }
  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: { 'Content-type': 'application/json'},
      body: JSON.stringify({
          input: this.state.input
      })
    })
    .then (response => response.json())
    .then( response => {
          if (response) {
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers: { 'Content-type': 'application/json'},
              body: JSON.stringify({
                  id: this.state.user.id
              })
            })
            .then ( response => response.json())
            .then (count => {
              this.setState(Object.assign(this.state.user, {entries: count}))
            })
            .catch(console.log)
          }
          this.displayFaceBox(this.calculateFaceLocation(response)) 
        })
        .catch (err => console.log(err));
    
   }
  render() {  
    var renderIt=null;
    if (this.state.route ==='home' && this.state.imageURL!=='') {
      renderIt =
      <div>
        <Logo/> 
        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition imageURL={this.state.imageURL} box={this.state.box}/> 
        <Credits/>
      </div> 
    }
    else if (this.state.route ==='home' && this.state.imageURL==='') {
      renderIt =
      <div>
        <Logo/> 
        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <Credits/>
      </div> 
    }
    else if (this.state.route ==='signin') {
      renderIt =
              <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
    }
    else {
      renderIt = 
              <Register loadUser= {this.loadUser} onRouteChange={this.onRouteChange}/>
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
