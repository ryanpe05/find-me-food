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
			latitude: 33.7845, //default coordinates so we have something to load
			longitude: -84.3455216,
			places: [],
		};
		this.fetchResults = this.fetchResults.bind(this);
	}

	watchID: ?number = null;

	componentDidMount = () => {
		//find the user's actual location if we can
		if (navigator && navigator.geolocation){
			navigator.geolocation.getCurrentPosition(
				(position) => {
					this.setState({latitude: position.coords.latitude});
					this.setState({longitude: position.coords.longitude});
					console.log("we have a location");
					console.log(position.coords.longitude);
					console.log(position.coords.latitude);
					this.fetchResults();
					this.props.onSubmit(this.state.places);
				},
				(error) => alert(error.message),
				{enableHighAccuracy: false, timeout: 30000, maximumAge: 1000}
			);
		}
		if(this.state.latitude !== 'unknown'){
			//fetch restaurants with our keyword near us that are open now
			this.fetchResults();
			console.log("we are fetching");
		}
		//this allows for constant location updates
		this.watchID = navigator.geolocation.watchPosition((position)=>{
			this.setState({latitude: position.coords.latitude});
			this.setState({longitude: position.coords.longitude});
		})
	}

	componentDidUpdate = () => {
		//find new places if the user chooses
		this.props.onSubmit(this.state.places);
	}

	componentWillReceiveProps() {
		//update when parent updates
		this.fetchResults();
		this.props.onSubmit(this.state.places);
	}

	//api request
	fetchResults(){
		$.getJSON(this.props.addr+this.state.latitude+','+this.state.longitude+'&type=restaurant&keyword='+this.props.value+'&key='+placesAPIKey+'&rankby=distance&opennow/')
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
			crossorigin: "Try CrossOrigin",
			starterURL: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleAPI = this.handleAPI.bind(this);
		this.renderMap = this.renderMap.bind(this);
		this.working = this.working.bind(this);
	}

	handleChange(event){
		//handles changes to the text field
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
		//formats data from api
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
	        		<li><div className = "title">{nameArr[0]}: </div><a href = {urlArr[0]}>Take Me There</a></li>
	        		<li><div className = "title">{nameArr[1]}: </div><a href = {urlArr[1]}>Take Me There</a></li>
	        		<li><div className = "title">{nameArr[2]}: </div><a href = {urlArr[2]}>Take Me There</a></li>
	        		<li><div className = "title">{nameArr[3]}: </div><a href = {urlArr[3]}>Take Me There</a></li>
	        		<li><div className = "title">{nameArr[4]}: </div><a href = {urlArr[4]}>Take Me There</a></li>
	        	</ol>
	        });
	    }
	}

	renderMap(){
		//renders the map on user input
		this.setState({mapVal : <Container value = {this.state.value} onSubmit = {this.handleAPI} addr = {this.state.starterURL}/>});
	}

	working(){
		//tries to use crossorigin.me as a proxy for api calls 
		if(this.state.crossorigin == "Try CrossOrigin"){
			this.setState({crossorigin: "Disable CrossOrigin"});
			this.setState({starterURL: 'https://crossorigin.me/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='});
		}else{
			this.setState({crossorigin: "Try CrossOrigin"});
			this.setState({starterURL: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='});
		}
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
					<button className = "findFood" onClick ={this.working}>{this.state.crossorigin}</button>
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
				<div className = "welcome">Hungry? Select a Food Below!</div>
			      <div><UserInput /></div>
			</div>
		);
	}
}



// React initialization stuff
ReactDOM.render(<Screen />, document.getElementById('root'));
registerServiceWorker();
