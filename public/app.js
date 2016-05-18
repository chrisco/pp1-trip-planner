$(document).ready(function() {
	console.log("jQuery is loaded");
	$.get("venues.json").then(createOptions);

	function createOptions(rawData) {
		rawData.Sheet1.forEach(function(venue) {
			// console.log(venue);
			var $option = $("<option>")
				.text(venue.venue)
				.attr("value", venue.address);
      var $option2 = $option.clone();
      $("#start").append($option);
      $("#end").append($option2);
		});
	}

  init();
});
