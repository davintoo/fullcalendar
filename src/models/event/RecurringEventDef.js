
var RecurringEventDef = EventDef.extend({

	startTime: null, // duration
	endTime: null, // duration, or null
	dowHash: null, // object hash, or null


	buildInstances: function(start, end) {
		var date = start.clone();
		var instanceStart, instanceEnd;
		var instances = [];

		while (date.isBefore(end)) {

			// if everyday, or this particular day-of-week
			if (!this.dowHash || this.dowHash[date.day()]) {

				instanceStart = date.clone();
				instanceEnd = null;

				if (this.startTime) {
					instanceStart.time(this.startTime);
				}
				else {
					instanceStart.stripTime();
				}

				if (this.endTime) {
					instanceEnd = date.clone().time(this.endTime);
				}

				instances.push(
					new EventInstance(
						this, // definition
						new EventDateProfile(instanceStart, instanceEnd)
					)
				);
			}

			date.add(1, 'days');
		}

		return instances;
	},


	setDow: function(dowNumbers) {

		if (!this.dowHash) {
			this.dowHash = {};
		}

		for (var i = 0; i < dowNumbers.length; i++) {
			this.dowHash[dowNumbers[i]] = true;
		}
	},


	clone: function() {
		var def = EventDef.prototype.clone.call(this);

		if (def.startTime) {
			def.startTime = moment.duration(this.startTime);
		}

		if (def.endTime) {
			def.endTime = moment.duration(this.endTime);
		}

		if (this.dowHash) {
			def.dowHash = $.extend({}, this.dowHash);
		}

		return def;
	}

});


RecurringEventDef.addReservedProps([ 'start', 'end', 'dow' ]);


// Parsing
// ---------------------------------------------------------------------------------------------------------------------


RecurringEventDef.parse = function(rawProps) {
	var def = EventDef.parse.apply(this, arguments); // a RecurringEventDef

	if (rawProps.start) {
		def.startTime = moment.duration(rawProps.start);
	}

	if (rawProps.end) {
		def.endTime = moment.duration(rawProps.end);
	}

	if (rawProps.dow) {
		def.setDow(rawProps.dow);
	}

	return def;
};