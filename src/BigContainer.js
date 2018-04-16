import React, { Component } from 'react';
import MapContainer from './MapContainer';
import { GoogleApiWrapper } from 'google-maps-react';

class BigContainer extends Component{
	render(){
	    return (
	      <div className="BigContainer">
	          <MapContainer google={this.props.google} lat = {this.props.lat} long = {this.props.long} places = {this.props.places}/>
	        <br/>
	      </div>
	    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCknpX-wcDshh-XWHlPNSIDFa8TOjbm_YA',
  libraries: ['visualization']
})(BigContainer)