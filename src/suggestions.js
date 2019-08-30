import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

var API_IMG_URL="http://image.tmdb.org/t/p/w200/";

const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: 'inline',
    },
  });



const Suggestions = (props) => {
    const { classes } = props;
  
  const options = props.results.map(r => {
    
    if(r.vote_average>0){
        return (
            <Link to={{ pathname: `/details/${r.id}`}} key={r.id}>
                <ListItem button alignItems="flex-start" key={r.id} >
                    <ListItemAvatar>
                        <Avatar alt={r.name} src={API_IMG_URL + r.poster_path} />
                    </ListItemAvatar>
                    <ListItemText
                        primary={r.name}
                        secondary={
                            <React.Fragment>
                                <Typography component="span" className={classes.inline} color="textPrimary">
                                    {"Rating: " + r.vote_average}
                                </Typography>
                                {" Year: " + r.first_air_date.split("-")[0]}
                            </React.Fragment>
                        }
                    />
                </ListItem>
            </Link>
        )
    }
    
    })
  return options
}

Suggestions.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(Suggestions);