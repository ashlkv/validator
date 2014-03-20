ValidatorTooltip.make = function ($input, text) {
	var $tooltip = this.getTooltip($input),
			  $modal = $input.closest('.modal'),
			  $container = $modal.length ? $modal : $('body'),
			  tooltipId,
			  tooltipOffset;

	if ($tooltip.length) {
		$tooltip.text(text);
	}
	else {
		tooltipId = this.generateId();
		$input.attr(this.attribute, tooltipId);
		$tooltip = $('<div class="tooltip bottom error"></div>')
				  .text(text)
				  .attr({id: tooltipId});
		$container.append($tooltip);
		tooltipOffset = this.calculateTooltipOffset($input);
		$tooltip.css({left: tooltipOffset.left, top: tooltipOffset.top});
	}
};
ValidatorTooltip.remove = function ($input) {
	var self = this;
	$input.each(function () {
		var $this = $(this),
				  $tooltip = self.getTooltip($this);
		$this.attr(self.attribute, null);
		$tooltip.fadeOut(function () {
			$tooltip.remove();
		});
	});
};
ValidatorTooltip.show = function ($input) {
	this.getTooltip($input).addClass('in');
};
ValidatorTooltip.hide = function ($input) {
	this.getTooltip($input).removeClass('in');
};
ValidatorTooltip.generateId = function () {
	var string = '',
			  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
			  length = 8;
	for (var i = 0; i < length; i++) {
		string += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return string;
};
ValidatorTooltip.getTooltip = function ($input) {
	var tooltipId = $input.attr(this.attribute);
	return $('#' + tooltipId);
};
ValidatorTooltip.calculateTooltipOffset = function ($input) {
	var $tooltip = this.getTooltip($input),
			  inputOffset = $input.offset(),
			  inputLeft = inputOffset.left,
			  inputTop = inputOffset.top,
			  inputWidth = $input.outerWidth(),
			  inputHeight = $input.outerHeight(),
			  tooltipWidth = $tooltip.outerWidth(),
			  tooltipLeft = inputLeft + Math.round(inputWidth / 2) - Math.round(tooltipWidth / 2),
			  tooltipTop = inputTop + inputHeight + 5;
	return {left: tooltipLeft, top: tooltipTop};
};
ValidatorTooltip.attribute = 'data-validator-tooltip';
