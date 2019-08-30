import React from 'react';
import YouTube from 'react-youtube';
import Modal from 'react-responsive-modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';    


const KEY="81bb4e646e4533e6a9a3ac279f29cca5";


export default class TrailerModal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            open: props.open || false,    
            loading: true,
            videoData: null
        };

    }

    fetchVideos= (id) =>{
        let URL = `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${KEY}&language=en-US`;
        fetch(URL).then(response => {
            return response.json();
        }).then(data => {
            this.setState({videoData: data.results, loading: false});
        });
    }

    componentDidMount(){
        this.fetchVideos(this.props.tvID);
    }

    componentWillReceiveProps(props){
        this.fetchVideos(this.props.tvID);
        this.onOpenModal();
    }

    onOpenModal = () => {
        this.setState({ open: true, loading : true });
      };
     
      onCloseModal = () => {
        this.setState({ open: false });
      };

    
      _onReady(event) {
        event.target.pauseVideo();
      }

      render(){
        const { open } = this.state;
        let data;
        const opts = {
            height: '390',
            width: '640',
            playerVars: { 
              autoplay: 1
            }
          };

          if(!this.state.loading){
            data = 
                (
                <CircularProgress className="center" />
                );

          }
          else{
              data = this.state.videoData && this.state.videoData.length === 0 &&
              (<h4>Sorry, we couldn't find any videos.</h4>);
              
              data = this.state.videoData && this.state.videoData.length > 0 && 
              (<YouTube
                videoId={(this.state.videoData[0].type === "Trailer" || "Teaser") && (this.state.videoData[0].key)}
                opts={opts}
                onReady={this._onReady}
                
              />
            );
          }

          return (
              <Modal open={open} onClose={this.onCloseModal} center >
                  <Paper style={{ maxHeight: 390, height: 390, width: 640 }}>
                      {data}
                  </Paper>
              </Modal>);

      }




}