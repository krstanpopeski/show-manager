import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import EpisodeModal from './episodeModal';

const KEY="81bb4e646e4533e6a9a3ac279f29cca5";
var URL=`https://api.themoviedb.org/3/tv/`;

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

class TabsWrappedLabel extends React.Component {
  state = {
    value: '1',
    data: [],
    seasons: null,
    modal: null,
    loading: false
  };

  handleChange = (event,value) => {
    this.setState({ value });
    this.setState({loading: true}, () => this.fetchData2(value));
  };

  onEpisodeClick = (episodeNumber,seasonNumber) =>{
    let modalData = (<EpisodeModal open={true} episodeNumber={episodeNumber} seasonNumber={seasonNumber} tvId={this.props.id}/>);
    this.setState({modal: modalData});
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



  fetchData2 = (seasonNum) => {
    fetch(URL + this.props.id + "/season/" + seasonNum + "?api_key=" + KEY + "&language=en-US")
    .then(results => {
        return results.json();}).then(dataInput => {
          let listEpisodes;
          if(dataInput.episodes != null){
            listEpisodes = dataInput.episodes.map(episode => {
                return(
                  <div onClick={() => {this.onEpisodeClick(episode.episode_number, episode.season_number)}} key={episode.id}>
                    <ListItem key={episode.id} button divider>
                      <ListItemText primary={episode.episode_number + ". " + episode.name}
                        secondary={"Air date: " + this.convertDate(episode.air_date)} />
                    </ListItem>
                  </div>
                )
            })
          }
          else{
            listEpisodes= (<h4>Sorry, we couldn't find any data regarding Season: {seasonNum}!</h4>)
          }
            this.setState({data: listEpisodes, loading: false});
        });
    }

    buildSeasonsTab = (props) => {
      var result = Array(props.numSeasons).fill().map((_,i) => {
        return (
            <Tab key={"Season:" + (i+1)} value={""+ (i+1)} label={"Season: "+ (i+1)} />
        );
    });
  
    this.setState({seasons: result, data: []});
    }


  componentWillReceiveProps(nextProps){
    this.buildSeasonsTab(nextProps);
    this.setState({loading: true}, () => this.fetchData2(this.state.value));
  }

  componentWillMount(){
    this.buildSeasonsTab(this.props);
    this.setState({loading: true}, () => this.fetchData2(this.state.value));
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    var toShow = null;
    

    if(this.state.loading){
      toShow = (
        <Paper style={{ maxHeight: 400, overflow: 'auto', height: 400 }}>
          <div className="centerSeasonSpinner">
            <CircularProgress />
          </div>
        </Paper>
        );
    } 
    else if(!this.state.loading){
      
      toShow = (
        <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
          <List component="a" className={classes.root}>
            {this.state.data}
          </List>
        </Paper>);
    }

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} onChange={this.handleChange} scrollable
            scrollButtons="auto">
             {this.state.seasons}
          </Tabs>
        </AppBar>
        
          {toShow}
          {this.state.modal}
      </div>
    );
  }
}

TabsWrappedLabel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TabsWrappedLabel);