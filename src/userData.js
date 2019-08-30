import React from 'react';

export default class UserData extends React.Component{

    state = {
        user:''
    }

    componentDidMount(){
        fetch("http://localhost:3001/checkToken",{
            method: 'GET',
            headers:new Headers({
                'Authorization' : sessionStorage.getItem('jwtToken'),
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        })
        .then(res => {
            if(res.status === 401){
                res.json().then(data => alert(data.error));
            }
            else if(res.status === 200){
                res.json().then(data => console.log(data.firstname));
            }
        })
    }

    render(){
        return(
           <h1>{this.state.user.firstname}</h1> 
        );
    }
}