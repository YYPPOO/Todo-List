import React, { Component } from "react";
import ReactDOM from "react-dom";
import Input from "../presentational/Input.jsx";
import Application from "../presentational/Content.jsx";

class FormContainer extends Component {
  constructor() {
    super();
    this.state = {
      title: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }


  render() {
    const { title } = this.state;
    return (
      <form id="article-form">
        <Input
          text="title"
          label="title"
          type="text"
          id="input"
          value={title}
          handleChange={this.handleChange}
        />
        <Application />
      </form>
    );
  }
}
export default FormContainer;

const contDiv = document.getElementById("form");
contDiv ? ReactDOM.render(<FormContainer />, contDiv) : false;