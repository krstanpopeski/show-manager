import React from 'react';
import StarRatingComponent from 'react-star-rating-component';
import Fade from 'react-reveal/Fade';
import { withRouter } from "react-router";
import TabsWrappedLabel from "./seasonTab";
import CircularProgress from "@material-ui/core/CircularProgress";
import EpisodeModal from "./episodeModal";
import TrailerModal from "./trailerModal";
import CastList from './castList';
import Divider from '@material-ui/core/Divider';
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";



const key="81bb4e646e4533e6a9a3ac279f29cca5";
var API_URL="";
var API_IMG_URL="http://image.tmdb.org/t/p/w400/";

class DetailsShow extends React.Component{
    
    constructor(props){
        super(props);
        
        this.state = {
            show: 'false',
            genres: null,
            runTime: null,
            isLoading: true,
            modal: null,
            videoModal : null,
            loggedIn:false,
            user:"",
            alreadyAdded: false
        };
        this.getFirstAirDate = this.getFirstAirDate.bind(this);
        this.calculateAverageRunTime = this.calculateAverageRunTime.bind(this);
        this.notificationDOMRef = React.createRef();
    }



    componentWillReceiveProps(nextProps){

        this.fetchMovieDetails(nextProps.match.params.id);
        
    }

    fetchMovieDetails = (id) => {
        API_URL=`https://api.themoviedb.org/3/tv/${id}?api_key=${key}&language=en-US`;
        fetch(API_URL).then(results => {
            return results.json();}).then(data => {
                this.setState({show: data, genres: data.genres, runTime: data.episode_run_time, isLoading: false});       
                
            });
    } 

    componentWillMount() {
        const token = sessionStorage.getItem('jwtToken');
        
        if (token) {
            fetch("http://localhost:3001/checkToken", {
                method: 'GET',
                headers: new Headers({
                    'Authorization': token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                })
            })
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            loggedIn: true
                        }, () => {
                            response.json().then(data => {
                                if(data.email){
                                this.setState({
                                    user: data.email
                                }, () => {
                                    this.getShows();
                                })
                                }
                            })
                        });
                    }
                    else {
                        this.setState({
                            loggedIn: false
                        });
                    }
                });


            


           
        }
    }

    getShows = () => {
        const id = this.props.match.params.id;
        var data = {
                email:this.state.user
            }
        fetch("http://localhost:3001/api/shows",{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if(response.status === 200){
                response.json().then(data =>{
                            if(data.shows.some(function(x) {return x.id === id})){
                                this.setState({
                                    alreadyAdded:true
                                });
                            }
                })
            }
        })
    }

    componentDidMount() {
        this.setState({isLoading: true}, () => this.fetchMovieDetails(this.props.match.params.id));
    }

    showLatestEpisode = () => {
        let latestSeason = this.state.show.last_episode_to_air.season_number;
        let latestEpisode = this.state.show.last_episode_to_air.episode_number;
        let id = this.state.show.id;
        let tempModal = (<EpisodeModal open={true} episodeNumber={latestEpisode} seasonNumber={latestSeason} tvId={id}/>);
        this.setState({modal:tempModal});

    }

    showVideo = () => {
        let id = this.state.show.id;
        let videoModal =(<TrailerModal open={true} tvID={id}/>)
        this.setState({videoModal: videoModal});
    }

    getFirstAirDate(rawData){
        var rawFirstAirDate = rawData;
        var dateObject = new Date(rawFirstAirDate);
        var date = dateObject.getDate();
        var month = dateObject.getMonth();
        var year = dateObject.getFullYear();
        var monthNames = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
          ];
        return date + ", " + monthNames[month] + " " + year;
    }

    calculateAverageRunTime(){
        var array = [];
        array = this.state.show.episode_run_time;
        var average = 0;
        var counter = 0;
        for (var i=0; i<array.length;i++){
            average = average + array[i];
            counter++;
        }
        return average / counter;
    }

    addToFavorites(){
        if(!this.state.loggedIn){
            this.props.history.push('/login');
        }
        else{
            var data =  {
                email: this.state.user,
                id: this.state.show.id,
                name: this.state.show.original_name
            };
            fetch("http://localhost:3001/api/addShow",{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            .then(res => {
                if(res.status === 200){
                    this.setState({
                        alreadyAdded: true
                    });
                    this.notificationDOMRef.current.addNotification({
                        title: "Success!",
                        message: "Successfully added to favorites!",
                        type: "success",
                        insert: "top",
                        container: "top-center",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: { duration: 2000 },
                        dismissable: { click: true }
                      });
                    
                }
                else{
                    this.notificationDOMRef.current.addNotification({
                        title: "Error.",
                        message: "There was an error adding the show, try again later.",
                        type: "danger",
                        insert: "top",
                        container: "top-center",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: { duration: 2000 },
                        dismissable: { click: true }
                      });
                }
            })
        }
    }


    render(){
        let data;
        const { open} = this.state;

        if(this.state.isLoading){
            data = (
                <div className="center">
                    <CircularProgress size={60} />
                </div>)
        }
        
        else if(this.state.runTIme!==null && this.state.genres !== null){
            data = ( 
                <div>
                    <div className="container-fluid row">
                        <div className="tvPoster col-lg-4">
                            <img alt={this.state.show.original_name} src={API_IMG_URL + this.state.show.poster_path} />
                        </div>
                        <div className="Title col-md-8">
                            <h2 style={{ fontWeight: 600 }} id="TitleText ">{this.state.show.original_name}</h2>
                            <p style={{ fontSize: 18 }}>{this.state.show.overview}</p>
                            <br />
                            <div className="ratingInfo inline-block">
                                <h4 className="hvr-underline-reveal" id="element1">Rating: {this.state.show.vote_average}</h4>
                                <h4 className="hvr-underline-reveal" id="element2">First Air Date:  {this.getFirstAirDate(this.state.show.first_air_date)}</h4>
                                <h4 className="hvr-underline-reveal" id="element3">Seasons: {this.state.show.number_of_seasons}</h4>
                                <h4 className="hvr-underline-reveal" id="element4">Episodes: {this.state.show.number_of_episodes}</h4>
                            </div>
                            <div style={{ fontSize: 30 }}>
                                <StarRatingComponent
                                    name="rate1"
                                    starCount={5}
                                    value={this.state.show.vote_average / 2}
                                />

                                <br />
                                <h4 className="hvr-underline-reveal" id="element5">Latest Air Date:  {this.getFirstAirDate(this.state.show.last_air_date)}</h4>
                                <h4 className="hvr-underline-reveal" id="element6">Average Episode Run Time:  {this.calculateAverageRunTime()} Minutes.</h4>
                                <h4 className="hvr-underline-reveal" id="element7">Genres: {this.state.genres.map(item => {
                                    return item.name;
                                }).join(', ')}</h4>
                                <br />
                                <br />
                                <div className="inline-block">
                                <a className="btn btn-primary btn-lg" href={this.state.show.homepage}>Homepage</a>
                                <button className="btn btn-primary btn-lg" onClick={() => this.showLatestEpisode()}>Latest Episode</button>
                                <button className="btn btn-primary btn-lg" onClick={() => this.showVideo()}>Trailer</button>
                                <button className="btn btn-primary btn-lg" disabled={this.state.alreadyAdded} onClick={() => this.addToFavorites()}>
                                    Add To Favorites.
                                    </button>
                                </div>
                                
                            </div>

                        </div>

                    </div>

                    

                    <div className="container-fluid seasons">
                        <br />
                        <Divider variant="middle"/>
                        <TabsWrappedLabel numSeasons={this.state.show.number_of_seasons} id={this.props.match.params.id}/>
                    </div>

                    <div>
                        <br />
                        <Divider variant="middle"/>
                        <br />
                        <h4>Cast:</h4>
                        <CastList tvID={this.props.match.params.id} />
                        <br />
                    </div>

                </div>        
            )}
            return (
                <div>
                    <ReactNotification ref={this.notificationDOMRef} />
                    <Fade>{data}</Fade>
                    {this.state.modal}
                    {this.state.videoModal}
                </div>
                );
    }
}

export default withRouter(DetailsShow);