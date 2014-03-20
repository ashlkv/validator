var ValidatorDemo = {};

ValidatorDemo.Form = function (data) {
	data = data || {};
	this.$element = data.$element;
};
ValidatorDemo.Form.prototype.validate = function ($form) {
	var $firstName = $('[name="firstName"]', this.$element);
	// Resetting the validator
	Validator.reset($form);

	// First name must be specified
	Validator.validateRequired($firstName, 'First name must be specified');
};
ValidatorDemo.Form.prototype.submit = function ($form) {
	var $alertContainer = $('.submit-feedback-container', this.$element);
	ValidatorDemo.hideAlert();
	try {
		this.validate($form);
	}
	catch (e) {
		Validator.handleValidationException(e);
		return;
	}

	ValidatorDemo.showAlert({content: '<i class="glyphicon glyphicon-ok"></i> OK'}, $alertContainer);
};
ValidatorDemo.showAlert = function (options, $container) {
		var $alert,
				  templateId = 'alert-template';
		options = $.extend({}, options);
		$alert = $(('<div class="alert alert-{type} fade-in"></div>').replace('{type}', options.type)).html(options.content);
		$container.find('.alert').remove();
		$container.append($alert);
};
ValidatorDemo.hideAlert = function () {
	$('.alert').hide();
};

(function(){
	var $form = $('#form'),
			  form = new ValidatorDemo.Form({$element: $form});

	$form.submit(function (event) {
		event.preventDefault();
		form.submit();
	});
}());