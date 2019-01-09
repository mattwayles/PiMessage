import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase'

class App extends Component {
    state = {
        message: null,
        password: null,
        status: null,
        error: null
    };
  componentDidMount() {
      let config = {
          apiKey: "AIzaSyCG1z51iEEFRvypoX-ooGDvFE4PHQzCsQM",
          authDomain: "pimessage.firebaseapp.com",
          databaseURL: "https://pimessage.firebaseio.com",
      };
      firebase.initializeApp(config);
  }

  inputEntered = (e) => {

      this.setState({ [e.target.name]: e.target.value, status: null, error: null});
  };

  sendMessage = (message, password) => {
      if (!message || message.length < 1) {
          this.setState({ error: "Message cannot be empty" })
      }
      else if (password !== "12345") {
          this.setState({ error: "Incorrect password, please try again" });
      }
      else {
          let database = firebase.database();
          database.ref('message').set({
              message: message
          }).then(() => {
              this.setState({status: "Message sent successfully!" , error: null})
          }).catch((err) => {
              this.setState({error: err.code})
          });

      }
  };

  render() {
      const {message, password, status, error} = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
            <p className={error? "Error" : "Status"}>{error ? error : status}</p>
            <input className="Input" type="text" name="message" placeholder={"New RemindR"} onChange={(e) => this.inputEntered(e)}/> <br />
            <input className="Input" type="password" name="password" placeholder={"Password"} onChange={(e) => this.inputEntered(e)}/> <br />
            <button className="Button" onClick={() => this.sendMessage(message, password)}>Remind Me</button>
        </header>
      </div>
    );
  }
}

export default App;
