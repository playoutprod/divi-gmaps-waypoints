// External Dependencies
import React, { Component} from 'react';

import {GoogleMap, Marker,withGoogleMap,DirectionsRenderer,InfoWindow} from 'react-google-maps';
// Internal Dependencies
import './style.css';

const MapWrapper = withGoogleMap((props) =>
    <GoogleMap defaultZoom={parseInt(props.data.zoom_level)} defaultCenter={{lat: parseFloat(props.data.address_lat),lng: parseFloat(props.data.address_lng)}}>
      {
        Object.keys(props.directions).length>0 && <DirectionsRenderer options={{suppressMarkers:true}} directions={props.directions} />
      }
      {
        props.data.content.map(function(marker,k){
          return(<Marker onClick={props.click.bind(this,marker)} key={k} title={ marker.props.attrs.title} name={marker.props.attrs.title} position={{lat: parseFloat(marker.props.attrs.pin_address_lat), lng: parseFloat(marker.props.attrs.pin_address_lng)}} />)
        })
      }
      {props.infoContent && <InfoWindow position={props.infoContent.position} onCloseClick={props.click.bind(this,null)}>
      <div className="content">
      <div className="title">{props.infoContent.title}</div>
      <div className="content">{props.infoContent.content.replace(/<[^>]*>?/gm, '')}</div>
      </div>
      </InfoWindow>}
    </GoogleMap>
);

class Digw extends Component {

  static slug = 'digw';

  constructor(props){
    super(props);
    this.state = {
      directions : {},
      infoContent:null,
      mapsLoaded:false
    }
    this.toggleInfoWindow = this.toggleInfoWindow.bind(this);
    this.setDirections = this.setDirections.bind(this);
  }
  componentDidMount(){
    const component = this;
    let count = 0;
    var digw_int = setInterval(function(){
      count++;
      console.log(window.google)
      if(window.google){
        component.setState({
          mapsLoaded:true
        });
        component.setDirections();
        clearInterval(digw_int);
      }
      if(count === 10){
        clearInterval(digw_int);
      }
    }, 2000);
  }
  setDirections(){
    const DirectionsService = new window.google.maps.DirectionsService();
    const pins = this.props.content;
    const route = pins.filter(function(marker) {
      if (marker.props.attrs.pin_address_lat && marker.props.attrs.pin_address_lng) {
        return true;
      }
      return false;
    }).map(function(marker,k){
      if(k === 0 || k === pins.length-1){
        return(new window.google.maps.LatLng(parseFloat(marker.props.attrs.pin_address_lat),parseFloat(marker.props.attrs.pin_address_lng)))
      }else{
        return({location : new window.google.maps.LatLng(parseFloat(marker.props.attrs.pin_address_lat),parseFloat(marker.props.attrs.pin_address_lng))})
      }
    })
    let waypoints = [];
    if(route.length>2){
      waypoints = route.slice(1, -1);
    }
    DirectionsService.route({
      origin: route[0],
      destination: route[route.length-1],
      waypoints:waypoints,
      travelMode: window.google.maps.TravelMode.DRIVING
    },(result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        this.setState({
          directions: result,
        });
      } else {
        console.error(`error fetching directions ${result}`);
      }
    });
  }
  toggleInfoWindow(target){
    let content = null;
    if(target !== null){
      let title = target.props.attrs.title ? target.props.attrs.title : "";
      if(title.length>0 || target.props.content.length>0){
        content = {
          title :title,
          content:target.props.content,
          position:{lat: parseFloat(target.props.attrs.pin_address_lat), lng: parseFloat(target.props.attrs.pin_address_lng)}
        }
      }
    }
    this.setState({
      infoContent : content
    })
  }
  render() {
    if(this.state.mapsLoaded){
      return (<div className="digw et_pb_map">
        <MapWrapper click={this.toggleInfoWindow} infoContent={this.state.infoContent} directions={this.state.directions} data={this.props} containerElement={<div style={{height:'100%'}}/>} mapElement={<div style={{ height: `100%` }}/>}></MapWrapper>
      </div>)
    }else{
      return (<div className="digw et_pb_map"></div>)
    }
  }
}

export default Digw;
