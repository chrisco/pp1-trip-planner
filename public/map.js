var infowindow;

function initMap() {
  var markerArray = [];
  var distance; // See lines 56 to 61 (as of now, anyway)
  var duration; // And function at the bottom of the file

  // Instantiate a directions service.
  var directionsService = new google.maps.DirectionsService;

  // Create a map and center it on Manhattan.
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    // center: {lat: 40.771, lng: -73.974} // Manhattan
    center: {
      lat: 39.7576859,
      lng: -105.0072004
    } // Denver
  });

  // Create a renderer for directions and bind it to the map.
  var directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });

  infowindow = new google.maps.InfoWindow({
    content: ''
  })

  // Instantiate an info window to hold step text.
  var stepDisplay = new google.maps.InfoWindow;

  // Display the route between the initial start and end selections.
  calculateAndDisplayRoute(
    directionsDisplay, directionsService, markerArray, stepDisplay, map);
  // Listen to change events from the start and end lists.
  var onChangeHandler = function() {
    calculateAndDisplayRoute(
      directionsDisplay, directionsService, markerArray, stepDisplay, map);
  };
  document.getElementById('start').addEventListener('change', onChangeHandler);
  document.getElementById('end').addEventListener('change', onChangeHandler);
}

function calculateAndDisplayRoute(directionsDisplay, directionsService,
  markerArray, stepDisplay, map) {
  // First, remove any existing markers from the map.
  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
  }

  // Close info window and get ready for next
  if (infowindow) {
    infowindow.close();
    infowindow.setMap(null);
  }

  // Retrieve the start and end locations and create a DirectionsRequest using
  // WALKING directions.
  directionsService.route({
    origin: document.getElementById('start').value,
    destination: document.getElementById('end').value,
    travelMode: google.maps.TravelMode.WALKING
  }, function(response, status) {
    // Route the directions and pass the response to a function to create
    // markers for each step.
    if (status === google.maps.DirectionsStatus.OK) {
      document.getElementById('warnings-panel').innerHTML =
        '<b>' + response.routes[0].warnings + '</b>';
      directionsDisplay.setDirections(response);

      // Get distance and duration.
      distance = directionsDisplay.directions.routes[0].legs[0].distance.text;
      // console.log(distance);
      duration = directionsDisplay.directions.routes[0].legs[0].duration.text;
      // console.log(duration);
      // Update the distance and duration.
      infowindow.setContent('Distance:' + distance + '<br/>Duration:' + duration);
      showSteps(response, markerArray, stepDisplay, map);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function showSteps(directionResult, markerArray, stepDisplay, map) {
  // For each step, place a marker, and add the text to the marker's infowindow.
  // Also attach the marker to an array so we can keep track of it and remove it
  // when calculating new routes.
  var myRoute = directionResult.routes[0].legs[0];

  // Find a middle marker's index.
  var midIndex = Math.floor(myRoute.steps.length / 2);

  for (var i = 0; i < myRoute.steps.length; i++) {
    var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
    marker.setMap(map);
    marker.setPosition(myRoute.steps[i].start_location);
    attachInstructionText(
      stepDisplay, marker, myRoute.steps[i].instructions, map);

    // For one of the markers, display the route info.
    if (i == midIndex) {
      infowindow.open(map, markerArray[midIndex]);
    }
  }
}

function attachInstructionText(stepDisplay, marker, text, map) {
  google.maps.event.addListener(marker, 'click', function() {
    // Open an info window when the marker is clicked on, containing the text
    // of the step.
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });
}
