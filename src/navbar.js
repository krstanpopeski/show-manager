
import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';
import Search from './searchComponent';
import Avatar from '@material-ui/core/Avatar';
import avatarImage from './avatar.png';
import transparentBanner from './logo_transparent.png';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

class NavbarFeatures extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isWideEnough: false,
            loggedIn:false,
            user:""
        };
        this.onClick = this.onClick.bind(this);
        this.notificationDOMRef = React.createRef();
    }

    componentWillMount(){
        const token = sessionStorage.getItem('jwtToken');
        if(token){
            fetch("http://localhost:3001/checkToken",{
                method: 'GET',
                headers: new Headers({
                    'Authorization' : token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                })
            })  
            .then(res => {
                if(res.status === 200){
                    
                    res.json().then(data => {
                        var user = {
                        firstname: data.firstname,
                        lastname: data.lastname,
                        email:data.email
                        }
                        this.setState({
                            loggedIn:true,
                            user:user
                        })
                    });
                    
                }
                else{
                    return;
                }
            })
            
        }
    }

    onClick() {
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    handleLogout = () => {
        sessionStorage.removeItem('jwtToken');
        this.setState(
            {
                loggedIn:false
            }
        );
        this.notificationDOMRef.current.addNotification({
            title: "Success!",
            message: "Successfully logged out!",
            type: "success",
            insert: "top",
            container: "top-center",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: { duration: 2000 },
            dismissable: { click: true }
          });
        this.props.history.push('/');
    }

    render() {
        var logInOut;
        if(this.state.loggedIn){
            logInOut = (
                <NavItem>
                    <Dropdown className="userDropdown">
                        <DropdownToggle nav>
                            <div className="avatar">
                            <Avatar alt="avatar" src={avatarImage}/>
                            <div>{this.state.user.firstname + " " + this.state.user.lastname}</div>
                            </div>
                        </DropdownToggle>
                        <DropdownMenu>
                            <Link to="/shows">
                            <DropdownItem >Favorite Shows</DropdownItem>
                            </Link>
                            <DropdownItem onClick={this.handleLogout}>Log Out</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavItem>)
        }
        else{
            logInOut = (
                <NavbarNav className="registerLogin">
                    <NavItem>
                        <NavLink className='loginButton' to="/register">Register</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className='loginButton' to="/login">Log In</NavLink>
                    </NavItem>
                </NavbarNav>)
        }


        return (
            <Navbar color="indigo" dark expand="md" scrolling>
                <ReactNotification ref={this.notificationDOMRef} />
                <Link to="/">
                    <NavbarBrand>
                        <img src={transparentBanner} alt="logo_transparent_nav" className="logoNavbar"></img>
                    </NavbarBrand>
                </Link>
                {!this.state.isWideEnough && <NavbarToggler onClick={this.onClick} />}
                <Collapse isOpen={this.state.collapse} navbar>
                    <NavbarNav left>
                        <NavItem>
                            <NavLink to="/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/live-on-air/true">On The Air</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/tv-airing-today/true">Airing Today</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/checkToken">Check Token</NavLink>
                        </NavItem>
                    </NavbarNav>
                    <NavbarNav right>
                        {logInOut}
                        <NavItem>
                            <Search />
                        </NavItem>
                    </NavbarNav>
                </Collapse>
            </Navbar>
        );
    }
}

export default withRouter(NavbarFeatures)