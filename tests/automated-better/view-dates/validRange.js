
describe('validRange', function() {
	pushOptions({
		defaultDate: '2017-06-08'
	});

	describe('when one week view', function() { // a view that has date-alignment by default
		pushOptions({
			defaultView: 'agendaWeek' // default range = 2017-06-04 - 2017-06-11
		});

		describe('when default range is partially before validRange', function() {
			pushOptions({
				validRange: { start: '2017-06-06' }
			});

			it('allows full renderRange but restricts activeRange', function() {
				initCalendar();
				ViewDateUtils.expectRenderRange('2017-06-04', '2017-06-11');
				ViewDateUtils.expectActiveRange('2017-06-06', '2017-06-11');
			});
		});

		describe('when default range is partially after validRange', function() {
			pushOptions({
				validRange: { end: '2017-06-05' }
			});

			it('allows full renderRange but restricts activeRange', function() {
				initCalendar();
				ViewDateUtils.expectRenderRange('2017-06-04', '2017-06-11');
				ViewDateUtils.expectActiveRange('2017-06-04', '2017-06-05');
			});
		});

		describe('when default range is completely before validRange', function() {
			pushOptions({
				validRange: { start: '2017-06-14' } // a Wednesday
			});

			it('initializes at earliest partially visible week', function() {
				initCalendar();
				ViewDateUtils.expectRenderRange('2017-06-11', '2017-06-18');
				ViewDateUtils.expectActiveRange('2017-06-14', '2017-06-18');
			});
		});

		describe('when default range is completely before validRange', function() {
			pushOptions({
				validRange: { end: '2017-05-24' } // a Wednesday
			});

			it('initializes at latest partially visible week', function() {
				initCalendar();
				ViewDateUtils.expectRenderRange('2017-05-21', '2017-05-28');
				ViewDateUtils.expectActiveRange('2017-05-21', '2017-05-24');
			});
		});

		describe('when validRange is a function', function() {

			it('receives the nowDate', function() {
				var nowInput = '2017-06-09T06:00:00';

				var validRangeSpy = spyOnCalendarCallback('validRange', function(date) {
					expect(moment.isMoment(date)).toBe(true);
					expect(date).toEqualMoment(nowInput);
				});

				initCalendar({
					now: nowInput
				});

				expect(validRangeSpy).toHaveBeenCalled();
			});

			it('can return a range object with strings', function() {
				var validRangeSpy = spyOnCalendarCallback('validRange', function() {
					return { start: '2017-06-06' };
				});

				initCalendar();

				expect(validRangeSpy).toHaveBeenCalled();
				ViewDateUtils.expectRenderRange('2017-06-04', '2017-06-11');
				ViewDateUtils.expectActiveRange('2017-06-06', '2017-06-11');
			});

			it('can return a range object with moments', function() {
				var validRangeSpy = spyOnCalendarCallback('validRange', function() {
					return { start: $.fullCalendar.moment.parseZone('2017-06-06') };
				});

				initCalendar();

				expect(validRangeSpy).toHaveBeenCalled();
				ViewDateUtils.expectRenderRange('2017-06-04', '2017-06-11');
				ViewDateUtils.expectActiveRange('2017-06-06', '2017-06-11');
			});
		});
	});

	describe('when a three-day view', function() { // a view with no alignment
		pushOptions({
			defaultView: 'agenda',
			duration: { days: 3 }
		});

		describe('when default range is completely before of validRange', function() {
			pushOptions({
				validRange: { start: '2017-06-14' }
			});
			it('renders earliest three valid days', function() {
				initCalendar();
				ViewDateUtils.expectRenderRange('2017-06-14', '2017-06-17');
				ViewDateUtils.expectActiveRange('2017-06-14', '2017-06-17');
			});
		});

		describe('when default range is completely after validRange', function() {
			pushOptions({
				validRange: { end: '2017-05-31' }
			});
			it('renders latest possible valid day and two invalid days', function() {
				initCalendar();
				ViewDateUtils.expectRenderRange('2017-05-30', '2017-06-02');
				ViewDateUtils.expectActiveRange('2017-05-30', '2017-05-31');
			});
		});
	});
});