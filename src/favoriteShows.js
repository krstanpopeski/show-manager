import React from 'react';
import { Link } from 'react-router-dom'
import StarRatingComponent from 'react-star-rating-component';
import Fade from 'react-reveal/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

const KEY = '81bb4e646e4533e6a9a3ac279f29cca5';
var API_IMG_URL="http://image.tmdb.org/t/p/w400/";


export default class FavoriteShows extends React.Component{

    state = {
        user:'',
        shows:[],
        showsData:[],
        loading:true
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
                res.json().then(data => {
                    this.setState({
                        user: data.email
                    },()=>{
                        this.getShows();
                    })
                })
            }
        })
    }

    populateShows(){
        this.state.shows.forEach(item => {
            fetch(`https://api.themoviedb.org/3/tv/${item.id}?api_key=${KEY}&language=en-US`)
            .then(response => {
                return response.json();
            })
            .then(pic => {
                var tempShow = (
                    <div className="col movie-box" key={pic.id}>
                        <Link to={{ pathname: `/details/${pic.id}` }}>
                            <div className="hvr-grow">
                                <img id="image" alt="posterImage" key={pic.id} src={"http://image.tmdb.org/t/p/w300/" + pic.poster_path} />
                                <div className="middle">
                                    <h3 >Rating:</h3>
                                    <StarRatingComponent
                                        name="rate1"
                                        starCount={5}
                                        value={pic.vote_average / 2}
                                    />
                                    <p className="text">{pic.vote_average}</p>
                                </div>
                            </div>
                            <h5 className="textUnderPoster">{pic.original_name}</h5>
                        </Link>
                    </div>
                )
                this.setState({
                    showsData:[...this.state.showsData,tempShow]
                })
            })
        });
        this.setState({
            loading:false
        })
    }

    getShows = () => {
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
                      if(data.shows.length!==0){
                      this.setState({
                          shows:data.shows
                      },() => {
                          this.populateShows();
                      })
                    }      
                })
            }
        })
    }

    render() {
        if (this.state.loading && this.state.showsData.length !==0) {
            return <CircularProgress className="center" alt="loadingSpinner" size={60} />
        }
        else {
            if (this.state.showsData.length === 0) {
                return (
                    <div>
                        <h3 className="centerMessage pale">You don't have any favorites show yet.</h3>
                    </div>
                );
            }
            else {
                return (<Fade>
                    <div>
                        <div>
                            <strong><h3 className="h3FavoriteShow">Favorite Shows</h3></strong>
                        </div>
                        <div className="gallery-grid2">
                            <div className="container-fluid">
                                <div className="row">
                                    {this.state.showsData}
                                </div>
                            </div>
                        </div>
                    </div>
                </Fade>);
            }
        }
    }
}