import React from 'react';
import TextField from '@material-ui/core/TextField';
import Fade from 'react-reveal/Fade';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import logo from './logo_transparent.png';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";



export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorEmail: false,
            email: '',
            password: '',
            errorLogin: false,
            errorLoginText: ''
        };
        this.notificationDOMRef = React.createRef();
    }
    onSubmit = (event) => {
        event.preventDefault();
        var test = {    
            email:this.state.email,
            password:this.state.password
        };
        if (!this.state.errorEmail) {
            fetch("http://localhost:3001/api/authenticate",
                {
                    method: 'POST',
                    body: JSON.stringify(test),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => {
                    if (res.status === 200) {
                        res.json().then(data => {
                            sessionStorage.setItem('jwtToken',data.token);
                            this.notificationDOMRef.current.addNotification({
                                title: "Success",
                                message: "Successfully logged in!",
                                type: "success",
                                insert: "top",
                                container: "top-center",
                                animationIn: ["animated", "fadeIn"],
                                animationOut: ["animated", "fadeOut"],
                                dismiss: { duration: 2000 },
                                dismissable: { click: true }
                              });
                        })
                        setTimeout(()=>{document.location.href="/";},1000);
                        
                        
                    }
                    else {
                        res.json().then(data=>{
                            var error = "Something went wrong, try again later."
                            if(data.error){
                                error = data.error;
                                this.notificationDOMRef.current.addNotification({
                                    title: "Error",
                                    message: error,
                                    type: "danger",
                                    insert: "top",
                                    container: "top-center",
                                    animationIn: ["animated", "fadeIn"],
                                    animationOut: ["animated", "fadeOut"],
                                    dismiss: { duration: 2000 },
                                    dismissable: { click: true }
                                  });
                            }
                            this.setState({
                                errorLogin:true,
                                errorLoginText:error
                            });

                        });
                    }
                })
                
                
        }

        
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
        let password = event.target.value;
        this.setState({
            password:password
        });
    }
  
    render() {     
      return (
            <Fade>
                <div className="loginForm">
                    <ReactNotification ref={this.notificationDOMRef} />
                    <img src={logo} alt="logo_transparent" className='loginLogo' />
                    <form onSubmit={this.onSubmit} noValidate autoComplete="off">

                        <FormControl>
                            <TextField
                                id="email"
                                name="email"
                                label="E-mail"
                                margin="normal"
                                autoFocus={true}
                                className="inputBox"
                                onChange={this.handleEmailChange}
                                error={this.state.errorEmail}
                            />
                            <FormHelperText id="email-error-text"
                                error={this.state.errorEmail}
                                disabled={!this.state.errorEmail}>{this.state.errorEmail && "Invalid E-mail" || !this.state.errorEmail && "Enter your E-mail address"}</FormHelperText>
                        </FormControl>
                        <br />
                        <FormControl>
                            <TextField
                                id="password"
                                name="password"
                                label="Password"
                                onChange={this.handlePasswordChange}
                                margin="normal"
                                type="password"
                                className="inputBox"
                            />
                            <FormHelperText id="password-info"
                                error={false}
                            >Enter your password.</FormHelperText>
                        </FormControl>
                        <br />
                        <br />
                        <FormControl>
                            <button type="submit" className="btn btn-primary btn-lg">LOG IN</button>
                        </FormControl>
                    </form>
                </div>
            </Fade>)
    }
}