$(document).ready(function() {
	// $.get("venues.json").then(createOptions); // TODO: Better name: things?

	function createOptions(rawData) { // TODO: Better name???
		rawData.forEach(function(thing) { // TODO: Better name: thing?
			var $option = $("<option>")
				.text(thing.name + " at " + thing.venue)
				.attr("value", thing.address);
			var $option2 = $option.clone();
			$("#start").append($option);
			$("#end").append($option2);
		});
	}

	init(function(data) {
		createOptions(data);
	});
});
