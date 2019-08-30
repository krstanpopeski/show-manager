import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import StarRatingComponent from 'react-star-rating-component';
import Fade from 'react-reveal/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';

const KEY = '81bb4e646e4533e6a9a3ac279f29cca5';
const API_URL = `https://api.themoviedb.org/3/discover/tv?api_key=${KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=`;
const API_ON_AIR_URL = `https://api.themoviedb.org/3/tv/on_the_air?api_key=${KEY}&language=en-US&page=`;
const API_AIRING_TODAY_URL = `https://api.themoviedb.org/3/tv/airing_today?api_key=${KEY}&language=en-US&page=`;
var currentPage = 1;
var maxPages = 0;


export default class DiscoverShows extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pictures: [],
            toDetails: false,
            isLoading: true,
            infiniteLoading: false
        };

        this.handleClick = this.handleClick.bind(this);
        this.loadPage = this.loadPage.bind(this);


    }

    handleClick = () => {
        this.setState({ toDetails: true });
    }

    componentWillMount() {
        currentPage = 1;
        this.scrollListener = window.addEventListener('scroll', (e) => {
            this.handleScroll(e);
        })
    }

    handleScroll = (e) => {
        var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        var clientHeight = document.documentElement.clientHeight || window.innerHeight;
        var scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

        if (scrolledToBottom) {
            this.setState({infiniteLoading: true}, () => {this.loadPage(true);});
            
        }
    }



    componentDidMount() {
        this.loadPage(false);
    }

    loadPage(increment) {

        if (increment) {
            currentPage++;
        }

        if (currentPage === maxPages) {
            return;
        }
        else {
            let URL;
            if (this.props.match.params.flag) {
                URL = API_ON_AIR_URL + currentPage.toString();
            }
            else if(this.props.match.params.today){
                URL = API_AIRING_TODAY_URL + currentPage.toString();
            }
            else{
                URL = API_URL + currentPage.toString();
            }
            fetch(URL).then(results => {
                return results.json();
            }).then(data => {
                maxPages = data.total_results;
                var newPictures = []
                newPictures = data.results.map(pic => {
                    return (
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
                                <h5 align="center">{pic.original_name}</h5>
                            </Link>
                        </div>

                    )

                });
                this.setState({ isLoading: false, infiniteLoading: false, pictures: [...this.state.pictures, ...newPictures] });


            })

        }
    }


    render() {
        let data;
        if(this.state.infiniteLoading){ 
            data = (
                <div className="centerDiv">
                    <CircularProgress size={60} />
                </div>
            ) 
        }
        else{
            data = null;
        }
        if (this.state.isLoading) {
            return <CircularProgress className="center" alt="loadingSpinner" size={60}/>
        }
        else {
            return (
                <Fade>
                    <div className="gallery-grid">
                        <div className="container-fluid">
                            <div className="row">
                                {this.state.pictures}
                            </div>
                        </div>
                        {data}
                    </div>
                </Fade>  
                  
                )
                
        }
    }
}