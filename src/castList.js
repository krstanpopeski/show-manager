import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/core/IconButton/IconButton';


const KEY = `81bb4e646e4533e6a9a3ac279f29cca5`;



const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.white,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
});

class CastList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
        }
    }

    fetchData = (tvID) => {
        const { classes } = this.props;
        var IMG_PATH = `http://image.tmdb.org/t/p/w780/`;
        var URL = `https://api.themoviedb.org/3/tv/${tvID}/credits?api_key=${KEY}&language=en-US`;
        fetch(URL).then(results => {
            return results.json();
        }).then(data => {
            let listData = data.cast.map(item => {
                return (
                    <GridListTile key={item.credit_id}>
                        <img style={ { height: 400, width: 290 } } src={IMG_PATH + item.profile_path} alt={item.character} />
                        <GridListTileBar
                            title={item.name}
                            classes={{
                                root: classes.titleBar,
                                title: classes.title,
                            }}
                            subtitle={"As " + item.character}
                            actionIcon={
                                <IconButton>
                                    <StarBorderIcon className={classes.title} />
                                </IconButton>
                            }
                        />
                    </GridListTile>

                )
            })
            this.setState({ data: listData });
        });
    }

    componentWillMount() {
        this.fetchData(this.props.tvID);
    }

    componentWillReceiveProps(nextProps){
        this.fetchData(nextProps.tvID);
    }


    render() {

        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <GridList className={classes.gridList} cols={4.9}>
                    {this.state.data}
                </GridList>
            </div>
        );
    }

}

CastList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CastList);