var ValidatorText = {
	errors: {
		valueRequired: 'This field is required.',
		hasBadSymbols: 'This field contains bad symbols.',
		shouldBeNoLessThan: 'This field\'s value should be no less than {min}.',
		shouldBeNoGreaterThan: 'This field\'s value should be no greater than {max}.',
		invalidEmail: 'This email address is incorrect.',
		shouldBeANumber: 'This fields\'s value should be a number.',
		shouldContainMinCharacters: 'This field should contain at least {min} characters.'
	}
};

/**
 * Contains methods related to attribute-based validation.
 */
var Validator = {
	emailPattern: '^[a-zA-Z0-9_\.\-]+\@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$',
	/**
	 * Creates error message element which is displayed until input matches the pattern.
	 * @param {RegExp} regexp Regular expression to match input value against.
	 * @param {jQuery} $input The input to attach an error message to.
	 * @param {String} text Error text.
	 * @return {jQuery} Error message element.
	 */
	untilMatches: function(regexp, $input, text) {
		return this.untilTrue(function(value) {
			return regexp.test(value);
		}, $input, text);
	},
	/**
	 * Creates error message element which is displayed until input is not empty. (Message disappears when something is typed in the input).
	 * @param {jQuery} $input The input to attach an error message to.
	 * @param {String} text Error text.
	 * @return {jQuery} Error message element.
	 */
	untilNotEmpty: function($input, text) {
		return this.untilTrue(function(value) {
			return value && $.trim(value).length > 0;
		}, $input, text);
	},
	/**
	 * Creates error message element which is displayed until condition is met.
	 * @param {Function} callback Function which accepts input value as an argument, returns true if condition is met, and false otherwise.
	 * @param {jQuery} $input The input to attach an error message to.
	 * @param {String} text Error text.
	 */
	untilTrue: function(callback, $input, text) {
		var listener = function() {
			var $this = $(this);
			if (callback($this.val(), $input)) {
				ValidatorTooltip.hide($input);
				$input.removeClass('error');
				$this.off('keyup.validator', listener);
				$this.off('change.validator', listener);
			}
		};
		listener.validator = true;
		ValidatorTooltip.make($input, text);
		$input.on('keyup.validator', listener);
		$input.on('change.validator', listener);
	},
	/**
	 * Creates error message element which is displayed until certain event happens.
	 * @param {String} event jQuery event name (e.g., blur, mouseout)
	 * @param {jQuery} $input The input to attach an error message to.
	 * @param {String} text Error text.
	 */
	untilEvent: function(event, $input, text) {
		var handler = function() {
			ValidatorTooltip.hide($input);
			$input.removeClass('error');
		};
		handler.validator = true;
		ValidatorTooltip.make($input, text);
		$input.one(event + '.validator', handler);
	},
	unbindAll: function($inputs) {
		if ($inputs) {
			$inputs.off('.validator');
		}
	},
	/**
	 * Validates input with the "required" attribute specified.
	 * @param {jQuery} $input Input to validate.
	 * @param {text} message The message to display if validation fails.
	 * @throws ValidationException
	 */
	validateRequired: function($input, message) {
		var value = $.trim($input.val()),
				  self = this;
		if (!value) {
			throw new ValidationException(function() {
				return self.untilNotEmpty($input, message ? message : ValidatorText.errors.valueRequired);
			}, $input);
		}
	},
	/**
	 * Validates input with the "pattern" attribute specified.
	 * @param {jQuery} $input Input to validate.
	 * @param {string} pattern Pattern
	 * @param {text} message The message to display if validation fails.
	 * @throws ValidationException
	 */
	validatePattern: function($input, pattern, message) {
		var regexp = new RegExp(pattern),
				  value = $input.val(),
				  self = this;
		if (!regexp.test(value)) {
			throw new ValidationException(function() {
				return self.untilMatches(regexp, $input, message ? message : ValidatorText.errors.hasBadSymbols);
			}, $input);
		}
	},
	/**
	 * Validates input with the "min" attribute specified.
	 * @param {jQuery} $input Input to validate.
	 * @param {text} message The message to display if validation fails.
	 * @throws ValidationException
	 */
	validateMin: function($input, min, message) {
		var value = $input.val(),
				  self = this;
		if (min !== null && value < min) {
			throw new ValidationException(function() {
				return self.untilTrue(function(value) {
					return value >= min;
				}, $input, message ? message : ValidatorText.errors.shouldBeNoLessThan.replace('{min}', min));
			}, $input);
		}
	},
	/**
	 * Validates input with the "max" attribute specified.
	 * @param {jQuery} $input Input to validate.
	 * @param {text} message The message to display if validation fails.
	 * @throws ValidationException
	 */
	validateMax: function($input, max, message) {
		var value = $input.val(),
				  self = this;
		if (max !== null && value > max) {
			throw new ValidationException(function() {
				return self.untilTrue(function(value) {
					return value <= max;
				}, $input, message ? message : ValidatorText.errors.shouldBeNoGreaterThan.replace('{max}', max));
			}, $input);
		}
	},
	/**
	 * Validates input that should contain an email.
	 * @param {jQuery} $input Input to validate.
	 * @param {text} message The message to display if validation fails.
	 * @throws ValidationException
	 */
	validateEmail: function($input, message) {
		var value = $input.val(),
				  regexp = new RegExp(this.emailPattern),
				  self = this;
		if (!regexp.test(value)) {
			throw new ValidationException(function() {
				return self.untilMatches(regexp, $input, message ? message : ValidatorText.errors.invalidEmail);
			}, $input);
		}
	},
	/**
	 * Validates input that should contain a number.
	 * @param {jQuery} $input Input to validate.
	 * @param {text} message The message to display if validation fails.
	 * @throws ValidationException
	 */
	validateNumber: function($input, message) {
		var value = $input.val(),
				  regexp = new RegExp(/^\d*$/),
				  self = this;
		if (!regexp.test(value)) {
			throw new ValidationException(function() {
				return self.untilMatches(regexp, $input, message ? message : ValidatorText.errors.shouldBeANumber);
			}, $input);
		}
	},
	/**
	 * Validates minimum length of the input value
	 * @param {jQuery} $input Input to validate.
	 * @param {number} minLength Minimum length
	 * @param {text} message The message to display if validation fails.
	 * @throws ValidationException
	 */
	validateMinLength: function($input, minLength, message) {
		var value = $.trim($input.val()),
				  self = this;
		if (minLength !== null && value.length < minLength) {
			throw new ValidationException(function() {
				message = message ? message
						  : ValidatorText.errors.shouldContainMinCharacters.replace('{min}', minLength);
				return self.untilTrue(function(value) {
					return value && $.trim(value).length >= minLength;
				}, $input, message);
			}, $input);
		}
	},
	/**
	 * Validates input according to the "type" attribute.
	 * @param {jQuery} $input Input to validate.
	 * @param {text} message The message to display if validation fails.
	 * @throws ValidationException
	 */
	validateType: function($input, message) {
		// Uses .getAttribute() DOM-method instead of .attr() jQuery method because jQuery so far ignores unknown HTML5 input types (email, number, etc).
		var type = $input.is('[type]') ? $input[0].getAttribute('type') : 'text', regexp, value = $input.val(), name = $input.attr('name');
		// Check value only if it is specified.
		if (value) {
			switch (type) {
				// Number
				case 'number':
					this.validateNumber($input, message);
					break;
				// Email
				case 'email':
					this.validateEmail($input, message);
					break;
				// Other
				default:
					break;
			}
		}
	},
	/**
	 * Validates input according to its validation-related attributes.
	 * @param {jQuery} $input Input to validate.
	 * @param {Object} messages Object with attribute names as keys and corresponding error messages as values.
	 * Example:
	 * {type: 'Should contain numbers only.',
	 * required: 'Quantity should be specified.',
	 * min: 'Should be greater than zero.',
	 * max: 'Should be no greater than 99.'}
	 */
	validateByAttributes: function($input, messages) {
		// Input type
		this.validateType($input, messages.type);
		// Required
		if ($input.is('[required]')) {
			this.validateRequired($input, messages.required);
		}
		// Pattern
		if ($input.is('[pattern]')) {
			this.validatePattern($input, $input.attr('pattern'), messages.pattern);
		}
		// Min
		if ($input.is('[min]')) {
			this.validateMin($input, $input.attr('min'), messages.min);
		}
		// Max
		if ($input.is('[max]')) {
			this.validateMax($input, $input.attr('max'), messages.max);
		}
	},
	showError: function($input, data, extraOffset, doNotFocus) {
		var $firstInput = $input.eq(0),
					  $modal = $firstInput.closest('.modal'),
					  $body = $('body'),
					  bodyScrollTop,
					  scrollDistance,
					  scrollTop,
					  scrollSpeed,
					  focusOnInput = function () {
						  // Если это не поле с календарём, то сфокусироваться
						  // (Если сфокусироваться на поле с календарём, то этот календарь появится, а это не очень красиво)
						  if (!$firstInput.data('datepicker') && !doNotFocus) {
							  $firstInput.focus();
						  }
					  };
		extraOffset = extraOffset ? extraOffset : 90;
		// If input is specified
		if (typeof data == "string") {
			ValidatorTooltip.make($input, data);
		}
		else if (typeof data == "function") {
			data();
		}
		$input.addClass('error');
		ValidatorTooltip.show($input);

		// If the input is not in the modal, scroll to input
		if (!$modal.length) {
			bodyScrollTop = $body.scrollTop();
			scrollTop = Math.round($firstInput.offset().top) - extraOffset;
			scrollDistance = Math.abs(bodyScrollTop - scrollTop);
			// Speed factor
			scrollSpeed = scrollDistance / 1.5;
			$body.animate({scrollTop: scrollTop}, scrollSpeed, 'swing', focusOnInput);
		}
		else {
			focusOnInput();
		}
	},
	showErrorUntilTrue: function(callback, $input, message) {
		var self = this;
		this.showError($input, function() {
			self.untilTrue(callback, $input, message);
		});
	},
	showErrorUntilEvent: function(event, $input, message) {
		var self = this;
		this.showError($input, function() {
			self.untilEvent(event, $input, message);
		});
	},
	/**
	 * Unbinds error handlers and removes error messages from inputs
	 * @param $inputs
	 */
	cleanInputs: function($inputs) {
		// Unbind validator handlers
		this.unbindAll($inputs);
		// Remove error messages
		ValidatorTooltip.remove($inputs);
		$inputs.removeClass('error');
	},
	/**
	 * Unbinds validator handlers and removes error messages, if any.
	 * @param {jQuery} $form Form
	 */
	reset: function($form) {
		var $inputs = $(':input', $form);
		$form = $form && $form instanceof jQuery ? $form : $('body');
		$inputs = $(':input', $form);
		this.cleanInputs($inputs);
	},
	/**
	 * Handles validation exception.
	 * @param {Object} e Exception.
	 */
	handleValidationException: function(e, extraOffset, doNotFocus) {
		if (!(e instanceof ValidationException)) {
			throw e;
		}
		if (e.$input) {
			this.showError(e.$input, e.data, extraOffset, doNotFocus);
		}
	}
};

/**
 * Validation exception. Thrown when validation fails.
 * @param {mixed} data Callback function or error text.
 * @param {jQuery} Input object.
 */
function ValidationException(data, $input) {
	this.data = data;
	this.$input = $input;
}

/**
 * Contains methods related to idividual input error messages.
 */
var ValidatorTooltip = {
	/**
	 * Adds (but does not show) a tooltip to the element
	 * @param {jQuery} $input jQuery input element
	 * @param {String} text Error text.
	 */
	make: function($input, text) {
		// Method is defined in adapter
	},
	/**
	 * Removes the tooltip from specified input.
	 * @param {jQuery} $input The element with tooltip to remove.
	 */
	remove: function($input) {
		// Method is defined in adapter
	},
	/**
	 * Shows input's tooltip.
	 * @param {jQuery} $input The element with tooltip to show.
	 */
	show: function($input) {
		// Method is defined in adapter
	},
	/**
	 * Hides input's tooltip.
	 * @param {jQuery} $input The element with tooltip to hide.
	 */
	hide: function($input) {
		// Method is defined in adapter
	}
};

