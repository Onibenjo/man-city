import React, { Component } from "react";
import FormField from "../ui/formField";
import { validate } from "../ui/misc";
import { firebase } from "../../firebase";

export default class SignIn extends Component {
  state = {
    formError: false,
    formSuccess: "",
    formdata: {
      email: {
        element: "input",
        value: "",
        config: {
          name: "email_input",
          type: "email",
          placeholder: "Enter your email"
        },
        validation: {
          required: true,
          email: true
        },
        valid: false,
        validationMessage: ""
      },
      password: {
        element: "input",
        value: "",
        config: {
          name: "password_input",
          type: "password",
          placeholder: "Enter your password"
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: ""
      }
    }
  };
  updateForm = element => {
    const newFormdata = { ...this.state.formdata };
    const newElement = { ...newFormdata[element.id] };
    newElement.value = element.e.target.value;
    let valiData = validate(newElement);
    // console.log(valiData);
    newElement.valid = valiData[0];
    newElement.validationMessage = valiData[1];
    newFormdata[element.id] = newElement;
    this.setState({
      formError: false,
      formdata: newFormdata
    });
  };
  submitForm(e) {
    e.preventDefault();
    let dataToSubmit = {};
    let formIsValid = true;
    for (let key in this.state.formdata) {
      dataToSubmit[key] = this.state.formdata[key].value;
      formIsValid = this.state.formdata[key].valid && formIsValid;
    }
    if (formIsValid) {
      firebase
        .auth()
        .signInWithEmailAndPassword(dataToSubmit.email, dataToSubmit.password)
        .then(() => this.props.history.push("/dashboard"))
        .catch(() =>
          this.setState({
            formError: true
          })
        );
    } else {
      this.setState({
        formError: true
      });
    }
  }
  render() {
    return (
      <div className="container">
        <div className="signin_wrapper" style={{ margin: 100 }}>
          <form action="" onSubmit={event => this.submitForm(event)}>
            <h2>Please Login</h2>
            <FormField
              id={"email"}
              formdata={this.state.formdata.email}
              change={element => this.updateForm(element)}
            />
            <FormField
              id={"password"}
              formdata={this.state.formdata.password}
              change={element => this.updateForm(element)}
            />
            <button onClick={e => this.submitForm(e)}>Login</button>
          </form>
        </div>
      </div>
    );
  }
}
