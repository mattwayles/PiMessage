import React, { Component } from 'react';
import logo from './rbplogo.png';
import './App.css';
import firebase from 'firebase'

class App extends Component {
    state = {
        current: "",
        message: null,
        password: null,
        status: null,
        error: null
    };
  componentWillMount() {
      let config = {
          apiKey: "AIzaSyBDjQDr1S1EotBtTdrOFLkGTDEL3Klgp-Y",
          authDomain: "remindbypi.firebaseapp.com",
          databaseURL: "https://remindbypi.firebaseio.com",
      };
      firebase.initializeApp(config);
      let database = firebase.database();
      let ref = database.ref('message');
      ref.on("value", (msg) => {
          if (msg.val()) {
              this.setState({current: msg.val().message});
          }
      }, () => {
          this.setState({ current: "ERROR - CAN'T READ DATABASE" })
      });
  }

  inputEntered = (e) => {
      this.setState({ [e.target.name]: e.target.value, status: null, error: null});
  };

  sendMessage = (message, password) => {
      window.scrollTo(0,0);
      this.setState({status: null , error: null, current: ""});
      if (!message || message.length < 1) {
          this.setState({ error: "Message cannot be empty" })
      }
      else if (this.validPw(password)) {
          this.updateDb(message)
      }
  };

  clearMessage = (password) => {
      if (this.validPw(password)) {
          this.updateDb(null)
      }
  };

  validPw = (pw) => {
      if (pw !== "12345") {
          this.setState({ error: "Incorrect password, please try again" });
          return false;
      }
      return true;
  };

  updateDb = (message) => {
      let database = firebase.database();
      setTimeout(() => database.ref('message').set({
          message: message
      }).then(() => {
          message ? this.setState({status: "Message sent successfully!"}) :
              this.setState({status: "Message removed successfully!"});
          setTimeout(() => this.setState({ status: null, current: message}), 4000);
      }).catch((err) => {
          this.setState({error: err.code})
      }), 100);
  };

  render() {
      const {message, password, status, error, current} = this.state;

      let p =
          error ? <p className="Error">{error}</p>
              : status ? <p className="Status">{status}</p>
              : current ? <p className="Current">{"Current Message: " + current}</p>
                  : null;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
            <section className="ButtonDiv">
                {p}
                {!error && !status && current ? <button className="CancelButton" onClick={() => this.clearMessage(password)}>X</button> : null}
            </section>
            <input autoComplete="off" className="Input" type="text" name="message" placeholder={"New Reminder"} onChange={(e) => this.inputEntered(e)}/> <br />
            <input className="Input" type="password" name="password" placeholder={"Password"} onChange={(e) => this.inputEntered(e)}/> <br />
            <button className="Button" onClick={() => this.sendMessage(message, password)}>Remind By Pi</button>
        </header>
      </div>
    );
  }
}

export default App;
