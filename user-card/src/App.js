import React, { Component } from 'react';
import axios from "axios";
import UserCard from "./components/UserCard";
import './App.css';

export default class App extends Component {
  state = {
    current_user: "",
    login: "",
    avatarURL: "",
    name: "",
    location: "",
    bio: "",
    followers: [],
    message: "",
    errorMsg: ""
  };

  componentDidMount() {
    axios
    .all([
      axios.get("https://api.github.com/users/ajablanco"),
      axios.get("https://api.github.com/users/ajablanco/followers")
    ])
    .then(
      axios.spread((userRes, followerRes) => {
        this.setState({
          login: userRes.data.login,
          avatarURL: userRes.data.avatar_url,
          name: userRes.data.name,
          location: userRes.data.location,
          url: userRes.data.html_url,
          bio: userRes.data.bio,
          followers: followerRes.data
        });
      })
    )
    .catch(err => console.log(err));
  }


handleChanges = e => {
  this.setState({
    current_user: e.target.value
  });
};

fetchUser = e => {
  e.preventDefault();
  axios
    .all([
      axios.get(`https://api.github.com/users/${this.state.current_user}`),
      axios.get(
        `https://api.github.com/users/${this.state.current_user}/followers`
      )
    ])
    .then(
      axios.spread((userRes, followerRes) => {
        this.setState({
          login: userRes.data.login,
          avatarURL: userRes.data.avatar_url,
          name: userRes.data.name,
          location: userRes.data.location,
          url: userRes.data.html_url,
          bio: userRes.data.bio,
          followers: followerRes.data,
          message: userRes.data.message,
          errorMsg: ""
        });
      })
    )
    .catch(err => {
      this.setState({
        errorMsg: "Invalid user, please try again"
      });
    });
};

render() {
  return(
    <div className="App">
      <h1>Github User Card</h1>
      <div className="card">
          {!this.state.errorMsg && (
            <UserCard 
              login={this.state.login}
              avatarURL={this.state.avatarURL}
              name={this.state.name}
              location={this.state.location}
              followers={this.state.followers}
              bio={this.state.bio}
              url={this.state.url}
            />
          )}
      </div>
      <div>
        <h4>Search by Username</h4>
        <input
        type="text"
        value={this.state.current_user}
        onChange={this.handleChanges} 
        placeholder="Enter username..."
        />
        <button className="btn" onClick={this.fetchUser}>Search</button>
        {this.state.errorMsg && (
          <p style={{ color: "red" }}>{this.state.errorMsg}</p>
        )}
      </div>
    </div>
  );
 }
}
  
  

