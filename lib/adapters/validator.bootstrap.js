ValidatorTooltip.make = function ($input, text) {
	// .data('tooltip') in Bootstrap 2 and .data('bs.tooltip') in Bootstrap 3
	var tooltip = $input.data('tooltip') || $input.data('bs.tooltip'),
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
ValidatorTooltip.remove = function ($input) {
	$input.each(function () {
		var $this = $(this),
				  // .data('tooltip') in Bootstrap 2 and .data('bs.tooltip') in Bootstrap 3
				  tooltip = $this.data('tooltip') || $this.data('bs.tooltip'),
				  $tooltip = tooltip ? tooltip.$tip : null;
		if (tooltip && $tooltip && $tooltip.is('.error')) {
			$this.tooltip('destroy');
		}
	});
};
ValidatorTooltip.show = function ($input) {
	$input.tooltip('show');
};
ValidatorTooltip.hide = function ($input) {
	$input.tooltip('hide');
};