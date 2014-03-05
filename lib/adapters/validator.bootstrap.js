ValidatorInputMessage.make = function ($input, text) {
	var tooltip = $input.data('tooltip'),
			  $modal = $input.closest('.modal');
	if (tooltip) {
		tooltip.options.title = text;
	}
	else {
		$input.tooltip({
			title: text,
			trigger: 'manual',
			placement: 'bottom',
			container: $modal.length ? $modal : $('body'),
			template: '<div class="tooltip error"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
		});
	}
};
ValidatorInputMessage.remove = function ($input) {
	$input.each(function () {
		var $this = $(this),
				  tooltip = $this.data('tooltip'),
				  $tooltip = tooltip ? tooltip.$tip : null;
		if (tooltip && $tooltip && $tooltip.is('.error')) {
			$this.tooltip('destroy');
		}
	});
};