$(document).ready(function() {
	// $.get("meetups.json").then(createOptions);

	function createOptions(data) {
		data.forEach(function(meetup) {
			var $option = $("<option>")
				.text(meetup.name + " at " + meetup.venue)
				.attr("value", meetup.address);
			var $option2 = $option.clone();
			$("#start").append($option);
			$("#end").append($option2);
		});
	}

	init(function(data) {
		createOptions(data);
	});
});
