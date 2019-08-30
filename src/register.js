import React from 'react';
import TextField from '@material-ui/core/TextField';
import Fade from 'react-reveal/Fade';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { timeout } from 'q';
import logo from './logo_transparent.png';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing.unit,
    },
    withoutLabel: {
      //marginTop: theme.spacing.unit * 3,
    },
    textField: {
      width: 230
    },
  });


class Register extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            errorEmail: false,
            errorPassword: false,
            errorFirstName: false,
            errorLastName: false,
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            repeatPassword: '',
        }
        this.notificationDOMRef = React.createRef();
    }

    

    onSubmit = (event) => {
        event.preventDefault();
        var test = {    
            firstname:this.state.firstName,
            lastname:this.state.lastName,
            email:this.state.email,
            password:this.state.password
        };
        if (!this.state.errorEmail && !this.state.errorFirstName 
            && !this.state.errorLastName && !this.state.errorPassword) {
                console.log("Pred fetch");
                fetch("http://localhost:3001/api/register",{
                method: 'POST',
                    body: JSON.stringify(test),
                    headers: {
                        'Content-Type': 'application/json'
                    }
            })
            .then(res => {
                if(res.status === 200){
                        this.notificationDOMRef.current.addNotification({
                            title: "Success",
                            message: "Successfully registered!",
                            type: "success",
                            insert: "top",
                            container: "top-center",
                            animationIn: ["animated", "fadeIn"],
                            animationOut: ["animated", "fadeOut"],
                            dismiss: { duration: 2000 },
                            dismissable: { click: true }
                        });
                      setTimeout(()=>{this.props.history.push('/login')},2000);
                }
                else if(res.status === 500){
                    res.json().then(data => {
                        this.notificationDOMRef.current.addNotification({
                            title: "Error",
                            message: data.error,
                            type: "danger",
                            insert: "top",
                            container: "top-center",
                            animationIn: ["animated", "fadeIn"],
                            animationOut: ["animated", "fadeOut"],
                            dismiss: { duration: 2000 },
                            dismissable: { click: true }
                          });

                    })
                    
                }
            })
            
        }

        
    }

    hanldeFirstNameChange = (event) => {
        this.setState({
            firstName: event.target.value,
            errorFirstName: event.target.value.length === 0
        })
    }

    hanldeLastNameChange = (event) => {
        this.setState({
            lastName: event.target.value,
            errorLastName: event.target.value.length === 0
        })
    }
  
    handleEmailChange = (event) => {
        let email = event.target.value;
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(String(email).length !== 0){
        this.setState(
            {errorEmail: !re.test(String(email).toLowerCase()),
            email:email}
        );
        }
        else{
            this.setState(
                {errorEmail: false}
            );
        }
    }

    handlePasswordChange = (event) => {
        this.setState({
            password:event.target.value
        }, function(){
            this.setState({
                errorPassword: this.state.password !== this.state.repeatPassword
            });
        });
    }

    handleRepeatPasswordChange = (event) => {
        this.setState({
            repeatPassword: event.target.value
        },function(){
            this.setState({
                errorPassword: this.state.password !== this.state.repeatPassword
            });
        });
    }


  
    render() {
        const {classes} = this.props;
      return (
          <Fade>
              <div className="loginForm">
              <ReactNotification ref={this.notificationDOMRef}/>
              <img src={logo} alt="logo_transparent" className='loginLogo'/>
                  <form onSubmit = {this.onSubmit} noValidate autoComplete="off">
                  <FormControl>
                      <TextField
                      id="firstname"
                      name="firstname"
                      label="First Name"
                      margin="normal"
                      autoFocus={true}
                      className={classNames(classes.margin,classes.textField)}
                      error={this.state.errorFirstName}
                      onChange={this.hanldeFirstNameChange}
                      />
                  </FormControl>
                  <FormControl>
                      <TextField
                      id="lastname"
                      name="lastname"
                      label="Last Name"
                      margin="normal"
                      className={classNames(classes.margin,classes.textField)}
                      error={this.state.errorLastName}
                      onChange={this.hanldeLastNameChange}
                      />
                  </FormControl>
                  <br/>
                  <FormControl>
                      <TextField
                          id="email"
                          name="email"
                          label="E-mail"
                          margin="normal"
                          className={classNames(classes.margin,classes.textField)}
                          onChange={this.handleEmailChange}
                          error={this.state.errorEmail}
                      />
                      <FormHelperText id="email-error-text" 
                      error={this.state.errorEmail} 
                      disabled={!this.state.errorEmail}>{this.state.errorEmail && "Invalid E-mail" || !this.state.errorEmail && "Enter your E-mail address"}</FormHelperText>
                      </FormControl>
                      <br/>
                      <FormControl>
                      <TextField
                          id="password"
                          name="password"
                          label="Password"
                          onChange={this.handlePasswordChange}
                          margin="normal"
                          type="password"
                          className={classNames(classes.margin,classes.textField)}
                      />
                      <FormHelperText id="password-info" 
                        error={this.state.errorPassword}
                      >{this.state.errorPasssword && "Passwords don't match." || !this.state.errorPassword && "Enter your password."}.</FormHelperText>
                      </FormControl>
                      <FormControl>
                      <TextField
                          id="passwordRepeat"
                          name="passwordRepeat"
                          label="Password Repeat"
                          onChange={this.handleRepeatPasswordChange}
                          margin="normal"
                          type="password"
                          className={classNames(classes.margin,classes.textField)}
                          
                      />
                      <FormHelperText id="password-info2" 
                         error={this.state.errorPassword}
                      >{(this.state.errorPasssword && "Passwords don't match.") || (!this.state.errorPassword && "Enter your password again.")}</FormHelperText>
                      </FormControl>
                      <br />
                      <br />
                      <FormControl>
                      <button type="submit" className="btn btn-primary btn-lg">Register</button>
                      </FormControl>
                  </form>
              </div>
          </Fade>)
        }
}

export default withStyles(styles)(Register)