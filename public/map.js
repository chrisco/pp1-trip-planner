let infowindow;

function initMap() {
  const markerArray = [];
  let distance;
  let duration;

  // Instantiate a directions service.
  const directionsService = new google.maps.DirectionsService();

  // Create a map and center it on Denver.
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {
      lat: 39.7576859,
      lng: -105.0072004,
    },
  });

  // Create a renderer for directions and bind it to the map.
  const directionsDisplay = new google.maps.DirectionsRenderer({
    map
  });

  infowindow = new google.maps.InfoWindow({
    content: ''
  });

  // Instantiate an info window to hold step text.
  const stepDisplay = new google.maps.InfoWindow();

  // Display the route between the initial start and end selections.
  calculateAndDisplayRoute(
    directionsDisplay,
    directionsService,
    markerArray,
    stepDisplay,
    map
  );

  // Listen to change events from the start and end lists.
  const onChangeHandler = function onChangeHandler() {
    calculateAndDisplayRoute(
      directionsDisplay,
      directionsService,
      markerArray,
      stepDisplay,
      map
    );
  };
  document.getElementById('start').addEventListener('change', onChangeHandler);
  document.getElementById('end').addEventListener('change', onChangeHandler);
}

function calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map) {
  // First, remove any existing markers from the map.
  for (let i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
  }

  // Close info window and get ready for next
  if (infowindow) {
    infowindow.close();
    infowindow.setMap(null);
  }

  // Retrieve the start and end locations and create a DirectionsRequest using WALKING directions.
  directionsService.route({
    origin: document.getElementById('start').value,
    destination: document.getElementById('end').value,
    travelMode: google.maps.TravelMode.WALKING,
  }, (response, status) => {
    // Route the directions and pass the response to a function to create markers for each step.
    if (status === google.maps.DirectionsStatus.OK) {
      document.getElementById('warnings-panel').innerHTML = '<b>' + response.routes[0].warnings + '</b>';
      directionsDisplay.setDirections(response);

      // Get distance and duration.
      distance = directionsDisplay.directions.routes[0].legs[0].distance.text;
      duration = directionsDisplay.directions.routes[0].legs[0].duration.text;

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
  const myRoute = directionResult.routes[0].legs[0];

  // Find a middle marker's index.
  const midIndex = Math.floor(myRoute.steps.length / 2);

  for (let i = 0; i < myRoute.steps.length; i++) {
    const marker = (markerArray[i] || new google.maps.Marker());
    marker.setMap(map);
    marker.setPosition(myRoute.steps[i].start_location);
    attachInstructionText(
      stepDisplay,
      marker,
      myRoute.steps[i].instructions,
      map
    );

    // For one of the markers, display the route info.
    if (i === midIndex) {
      infowindow.open(map, markerArray[midIndex]);
    }
  }
}

function attachInstructionText(stepDisplay, marker, text, map) {
  google.maps.event.addListener(marker, 'click', () => {
    // Open an info window when the marker is clicked on, containing the text of the step.
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });
}
