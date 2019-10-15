import React from 'react';
import './Register.css';

class Register extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            errorPlaceholder: ''
        }
    }
    onNameChange =(event) => {
        this.setState({ name: event.target.value})
    }
    onEmailChange =(event) => {
        this.setState({ email: event.target.value})
    }
    onPassChange =(event) => {
        this.setState({ password: event.target.value})
    }
    onSubmitRegister = (event) => {
        event.preventDefault();
        //from stackoverflow
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       
        if (this.state.name.length!==0 && this.state.password.length>= 6 && re.test(String(this.state.email).toLowerCase())) {
            fetch ( 'http://localhost:3000/register', {
                method: 'post',
                headers: { 'Content-type': 'application/json'},
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                    name: this.state.name
                })
            })
            .then(response => response.json())
            .then(user => {
                if (user.id) {
                    this.props.loadUser(user);
                    this.props.onRouteChange('signin');
                }
            })
            .catch(err => console.log('Error:', err)) 
        } else {
            this.setState({ errorPlaceholder: 'There is a problem with your input data. Try again!'});
        }
        
    }
    render () {
   
        return (
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <form className="measure" method="post">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Register</legend>
                        <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                        <input onChange={this.onNameChange}
                        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="name" name="name"  id="name"/>
                        </div>
                        <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                        <input onChange={this.onEmailChange}
                        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address"/>
                        </div>
                        <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input onChange={this.onPassChange}
                        className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password"/>
                        </div>
                    </fieldset>
                    <div className="">
                        <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Register" 
                                onClick={this.onSubmitRegister}/>
                    </div>
                    </form>
                    <p className="error">{this.state.errorPlaceholder}</p>
                </main>
            </article>
        );
    }
}

export default Register;