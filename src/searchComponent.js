import React from 'react';
import Suggestions from './suggestions';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';

const KEY = "81bb4e646e4533e6a9a3ac279f29cca5"; 
var URL = `https://api.themoviedb.org/3/search/tv?api_key=${KEY}&language=en-US&query=`;

export default class Search extends React.Component{

    constructor(props){
        super(props);

        this.state={
            query : '',
            results: [],
            show: false
        }
    }

    handleInputChange = (e) => {
        var value = e.target.value;
        this.setState({
            query: value
        }, () => {
            if (this.state.query && this.state.query.length > 1){
                if (this.state.query.length % 2 === 0 && this.state.query.trim().length!==0){
                    this.getSearchData();
                }
            }
            else if(this.state.query.trim().length === 0){
                this.setState({results: []}, () => {
                    this.setState({show: false});
                });
                
            }
        })
    }

    getSearchData = () => {
        fetch(`${URL}${this.state.query}`).then(results=>{
            return results.json();
        }).then(data => {
            this.setState({results: data.results}, () => {
                if(data.results.length !== 0){
                    this.setState({show: true});
                }
                else{
                    this.setState({show: false});
                }
            });
        })
    }

    alterShowSecond(focused){
        if(this.state.query.length >0 && focused){
            this.setState({show : true});
        }
        else if (!focused) {
            this.setState({show: focused});
        }
    }


    alterShow = () => {
        this.setState({show: !this.state.show});
       
    }
        
              

    render(){
        var showList;
            showList = (
                <Collapse in={this.state.show}>
                    <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
                        <List onClick={() => this.alterShow}>
                            <Suggestions results={this.state.results} />
                        </List>
                    </Paper>
                </Collapse>
            )
        return (    
            <div className="searchBar">
                <form className="form-inline md-form mt-0">
                    <input className="form-control mr-sm-2 mb-0 text-white hvr-hollow"
                        type="text" placeholder="Search all TV shows"
                        aria-label="Search all TV shows"
                        ref={input => this.search = input}
                        onChange={this.handleInputChange} 
                        onFocus={() => this.alterShowSecond(true)}
                        onBlur={() => this.alterShowSecond(false)}/>
                    <div className="itemList">
                        {showList}
                    </div>
                </form>
                
            </div>
        )
    }


}