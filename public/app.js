$(document).ready(function() {
	// $.get("meetups.json").then(createOptions);

	function createOptions(data) {
		$('#scrollable-dropdown-menu .typeahead').typeahead({
			minLength: 3,
			highlight: true
		}, {
			name: 'places',
			source: source
		});
		data.forEach(function(meetup) {
			var $option = $("<option>")
				.text(meetup.name + " - " + meetup.venue)
				.attr("value", meetup.address);
			var $option2 = $option.clone();
			$("#start").append($option);
			$("#end").append($option2);
		});

		function source(query, syncResults) {
			syncResults(data);
		}
	}

	init(function(data) {
		createOptions(data);
	});
});
