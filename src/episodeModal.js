import React from 'react';
import Modal from 'react-responsive-modal';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';



const KEY = "81bb4e646e4533e6a9a3ac279f29cca5";

export default class EpisodeModal extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            open: props.open || false,    
            loading: true,
            episodeData: null
        };

    }

    fetchEpisodeInfo= (tvID,episodeNumber,seasonNumber) =>{
        var URL = `https://api.themoviedb.org/3/tv/${tvID}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${KEY}&language=en-US`;
        fetch(URL).then(results => {
            return results.json();
        }).then(data => {
            this.setState({episodeData: data, loading:false});
        });
    }

    componentDidMount(){
        this.fetchEpisodeInfo(this.props.tvId,this.props.episodeNumber,this.props.seasonNumber);
    }

    componentWillReceiveProps(props){
        this.fetchEpisodeInfo(props.tvId,props.episodeNumber,props.seasonNumber);
        this.onOpenModal();
    }

    onOpenModal = () => {
        this.setState({ open: true, loading : true });
      };
     
      onCloseModal = () => {
        this.setState({ open: false });
      };
    
    convertDate = (rawData) => {
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

      

      render(){
        const {open} = this.state;
            if(!this.state.loading){
                var data = this.state.episodeData && (<Modal open={open} onClose={this.onCloseModal} center >
                    <p><b>Episode name:</b> {this.state.episodeData.name}</p>
                    <br />
                    <p><b>Overview:</b></p>
                    <p>{this.state.episodeData.overview}</p>
                    <p><b>Episode air date: </b>{this.convertDate(this.state.episodeData.air_date)}</p>
                    <p><b>Crew:</b></p>
                    <Paper style={{ maxHeight: 250, overflow: 'auto', height: 200 }}>
                        {this.state.episodeData.crew.map((person) => {
                            return (
                                <p key={person.name}> {person.job}: {person.name}</p>);
                        })}
                    </Paper>
                </Modal>);
            }
            else if(this.state.loading){
                data = (
                <Modal open={open} onClose={this.onCloseModal} center >
                        <Paper style={{ maxHeight: 300, height: 300, width:300 }}>
                            <CircularProgress className="center" />
                        </Paper>
                </Modal>);
            }
        
            return data ;
        
      }



}