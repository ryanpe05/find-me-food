import React, { Component } from 'react';
import ReactDOM from 'react-dom'

// a large majority of this class was taken from Matthew Thorry and referenced in his blog:
// https://medium.com/front-end-hacking/using-the-google-maps-javascript-api-in-a-react-project-b3ed734375c6
// comments were also left for clarity

export default class MapContainer extends Component {

  componentDidUpdate(prevProps, prevState) {
    this.loadMap();
  }

  loadMap() {
    if (this.props && this.props.google) { // checks to make sure that props have been passed
      const {google} = this.props; // sets props equal to google
      const maps = google.maps; // sets maps to google maps props
      const mapRef = this.refs.map; // looks for HTML div ref 'map'. Returned in render below.
      const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node
      const mapConfig = Object.assign({}, {
        center: {lat: this.props.lat, lng: this.props.long}, // sets center of google map to NYC.
        zoom: 13, // sets zoom. Lower numbers are zoomed further out.
        mapTypeId: 'roadmap' // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
      })

      this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.

      const marker = new google.maps.Marker({ // creates a new Google maps Marker object.
          position: {lat: this.props.lat, lng: this.props.long}, // sets position of marker to specified location
          map: this.map, // sets markers to appear on the map we just created on line 35
          title: "You", // the title of the marker is set to the name of the location
          label: "You"
      });

      if(this.props.places != null){
        console.log(this.props.places);
        var latArr = [];
        var longArr = [];
        var nameArr = [];
        var i;
        for(i = 0; i < this.props.places.length && i < 5; i++){
          nameArr[i] = this.props.places[i].name;
          latArr[i] = this.props.places[i].geometry.location.lat;
          longArr[i] = this.props.places[i].geometry.location.lng;
          const marker = new google.maps.Marker({ // creates a new Google maps Marker object.
            position: {lat: latArr[i], lng: longArr[i]}, // sets position of marker to specified location
            map: this.map, // sets markers to appear on the map we just created on line 35
            title: nameArr[i], // the title of the marker is set to the name of the location
            label: String(i+1)
          });
        }
      }
    }
  }

  render() {
    const style = { // MUST specify dimensions of the Google map or it will not work. Also works best when style is specified inside the render function and created as an object
      width: '40vw', // 90vw basically means take up 90% of the width screen. px also works.
      height: '75vh' // 75vh similarly will take up roughly 75% of the height of the screen. px also works.
    }

    return ( // in our return function you must return a div with ref='map' and style.
      <div ref="map" style={style}>
        loading map...
      </div>
    )
  }
}