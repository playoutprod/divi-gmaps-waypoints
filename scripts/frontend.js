jQuery(document).ready(function($){
  var digw_int = setInterval(function(){
    if(window.google){
      clearInterval(digw_int);
      digw_start($);
    }
  }, 3000);
});

function digw_start($){
  const directionsService = new window.google.maps.DirectionsService();

  $('.digw.et_pb_map').each(function(){
    var directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers:true});
    var node = $(this);
    map = new google.maps.Map(this,{
      center: {lat: parseFloat(node.attr('lat')),lng: parseFloat(node.attr('lng'))},
      zoom: parseFloat(node.attr('zoom'))
    });
    directionsRenderer.setMap(map);
    var route = calculateRoute(JSON.parse(node.attr('data')),map,directionsService,directionsRenderer);
  })
}
function calculateRoute(pins,map,directionsService,directionsRenderer){
  var infowindow = new google.maps.InfoWindow({content: ''});
  console.log(pins);
  const route = pins.filter(function(marker) {
    if (marker.lat && marker.lng) {
      return true;
    }
    return false;
  }).map(function(marker,k){
    if(k === 0 || k === pins.length-1){
      var pin = new google.maps.Marker({position:new window.google.maps.LatLng(parseFloat(marker.lat),parseFloat(marker.lng)), map: map});
      pin.addListener('click', function() {
        infowindow.setContent('<div class="title">'+marker.title+'</div><div class="content">'+marker.content+'</div>')
        infowindow.open(map, pin);
      });
      return(new window.google.maps.LatLng(parseFloat(marker.lat),parseFloat(marker.lng)))
    }else{
      var pin = new google.maps.Marker({position:new window.google.maps.LatLng(parseFloat(marker.lat),parseFloat(marker.lng)), map: map});
      pin.addListener('click', function() {
        infowindow.setContent('<div class="title">'+marker.title+'</div><div class="content">'+marker.content+'</div>')
        infowindow.open(map, pin);
      });
      return({location : new window.google.maps.LatLng(parseFloat(marker.lat),parseFloat(marker.lng))})
    }
  })
  let waypoints = [];
  if(route.length>2){
    waypoints = route.slice(1, -1);
  }
  directionsService.route({
    origin: route[0],
    destination: route[route.length-1],
    waypoints:waypoints,
    travelMode: window.google.maps.TravelMode.DRIVING
  },(result, status) => {
    if (status === window.google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
    } else {
      console.error(`error fetching directions ${result}`);
      return(null);
    }
  });
}
