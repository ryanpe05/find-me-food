import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {geolocated} from 'react-geolocated';
import registerServiceWorker from './registerServiceWorker';
import $ from 'jquery';

//simple tutorial imports
import { GoogleApiWrapper } from 'google-maps-react';
import BigContainer from './BigContainer';

const mapsAPIKey = 'AIzaSyCknpX-wcDshh-XWHlPNSIDFa8TOjbm_YA';
const searchAPIKey = "AIzaSyBA-u7N4jdh9RQZ6FyPXRJJCNZEyEZWz50";
const placesAPIKey = "AIzaSyCLqAhQn5Gm-9oNCSHcazQbMn-yE10JU0I";

// classes and whatnot
class Container extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			latitude: 'unknown',
			longitude: 'unknown',
			places: [],
		};
		this.fetchResults = this.fetchResults.bind(this);
	}

	watchID: ?number = null;

	componentDidMount = () => {
		if (navigator && navigator.geolocation){
			navigator.geolocation.getCurrentPosition(
				(position) => {
					this.setState({latitude: position.coords.latitude});
					this.setState({longitude: position.coords.longitude});
					this.fetchResults();
					this.props.onSubmit(this.state.places);
				},
				(error) => alert(error.message),
				{enableHighAccuracy: false, timeout: 30000, maximumAge: 1000}
			);
		}
		//this originally allowed for constant updates, but that isn't important for the demo
		// this.watchID = navigator.geolocation.watchPosition((position)=>{
		// 	this.setState({latitude: position.coords.latitude});
		// 	this.setState({longitude: position.coords.longitude});
		// })
		//fetch restaurants with our keyword near us that are open now
	}

	componentDidUpdate(){
		this.props.onSubmit(this.state.places);
	}

	fetchResults(){
		// fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+this.state.latitude+','+this.state.longitude+'&type=restaurant&keyword='+this.props.value+'&key='+placesAPIKey+'&rankby=distance&opennow/')
  		// .then(({ results }) => this.setState({ places: results }));
		$.getJSON('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+this.state.latitude+','+this.state.longitude+'&type=restaurant&keyword='+this.props.value+'&key='+placesAPIKey+'&rankby=distance&opennow/')
      	.then(({ results }) => this.setState({ places: results }));
	}	

	componentWillUnmount = () => {
		navigator.geolocation.clearWatch(this.watchID);
	}

  render() {
    return (
    	<div>
	      	<BigContainer google={this.props.google} lat = {this.state.latitude} long = {this.state.longitude} places = {this.state.places}/>
      	</div>
    );
  }
}

export class UserInput extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			value: '',
			buttonValue: "Find Me Chicken",
			mapVal: null,
			listVal: null,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleAPI = this.handleAPI.bind(this);
		this.renderMap = this.renderMap.bind(this);
	}

	handleChange(event){
		if(event.target.value === ''){
			this.setState({buttonValue: "Find Me Chicken"});
			this.setState({value: ''});
		}
		else{
			this.setState({buttonValue: "Find Me " + event.target.value});
			this.setState({value: event.target.value});
		}
	}

	handleAPI = (placeArr) => {
		console.log("handleAPI");
		console.log(placeArr);
		if(Array.isArray(placeArr) && placeArr.length){
			console.log("we are in the build phase");
	        var latArr = [];
	        var longArr = [];
	        var nameArr = [];
	        var urlArr = [];
	        var i;
	        for(i = 0; i < placeArr.length && i < 5; i++){
	          nameArr[i] = placeArr[i].name;
	          latArr[i] = placeArr[i].geometry.location.lat;
	          longArr[i] = placeArr[i].geometry.location.lng;
	          urlArr[i] = 'https://www.google.com/maps?saddr=My+Location&daddr='+latArr[i]+','+longArr[i];
	        }
        	console.log(nameArr);
	        this.setState({listVal: 
	        	<ol className = "listed">
	        		<li><div className = "title">{nameArr[0]}</div><a href = {urlArr[0]}>Take Me There</a></li>
	        		<li><div className = "title">{nameArr[1]}</div><a href = {urlArr[1]}>Take Me There</a></li>
	        		<li><div className = "title">{nameArr[2]}</div><a href = {urlArr[2]}>Take Me There</a></li>
	        		<li><div className = "title">{nameArr[3]}</div><a href = {urlArr[3]}>Take Me There</a></li>
	        		<li><div className = "title">{nameArr[4]}</div><a href = {urlArr[4]}>Take Me There</a></li>
	        	</ol>
	        });
	    }
	}

	renderMap(){
		this.setState({mapVal : <Container value = {this.state.value} onSubmit = {this.handleAPI}/>});
	}

	render(){
		return(
			<div>
				<div className = "userInput">
					<div className = "inputTitle">Type What You Want</div>
					<br/>
					<input className = "textBox" type = "text" placeholder = "Ex. Chicken" value = {this.state.value} onChange = {this.handleChange}/>
					<br/>
					<button className = "findFood" onClick ={this.renderMap}>{this.state.buttonValue}</button>
					<br/>
					<div>{this.state.listVal}</div>
				</div>
				<div className = "mapOutput">{this.state.mapVal}</div>
			</div>
		);
	}
}

export default class Screen extends Component{
	render(){
		return(
			<div>
				<div className = "welcome">Hungry? Select a Food Below</div>
			      <div><UserInput /></div>
			</div>
		);
	}
}



// React initialization stuff
ReactDOM.render(<Screen />, document.getElementById('root'));
registerServiceWorker();
