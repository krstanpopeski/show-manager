import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, } from "react-router-dom";
import NavbarFeatures from './navbar';
import DiscoverShows from "./discoverShows";
import DetailsShow from "./detailsShow";
import Login from "./login";
import Register from './register';
import UserData from './userData';
import FavoriteShows from './favoriteShows';
import './index.css';
import 'font-awesome/css/font-awesome.min.css';
import './hover-min.css';
import 'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';

class Index extends React.Component{
    render(){
        return(
            <BrowserRouter>
                <React.Fragment>
                    <NavbarFeatures/>
                    <Route exact path="/" component={DiscoverShows} />
                    <Route exact path="/live-on-air/:flag" component={DiscoverShows} />
                    <Route exact path="/tv-airing-today/:today" component={DiscoverShows} />
                    <Route exact path="/details/:id" component={DetailsShow}  />
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/checkToken" component={UserData}/>
                    <Route exact path="/shows" component={FavoriteShows}/>
                </React.Fragment>
            </BrowserRouter> 
            );        
    }
}

ReactDOM.render(<Index/>, document.getElementById("root"));