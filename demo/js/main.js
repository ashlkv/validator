var ValidatorDemo = {};

ValidatorDemo.Form = function (data) {
	data = data || {};
	this.$element = data.$element;
};
ValidatorDemo.Form.prototype.validate = function ($form) {
	var $firstName = $('[name="firstName"]', this.$element);
	// Resetting the validator
	// TODO Now with namespaced events do we need to reset validator at all?
	Validator.reset($form);

	// First name must be specified
	Validator.validateRequired($firstName, 'First name must be specified');
};
ValidatorDemo.Form.prototype.submit = function ($form) {
	var $alertContainer = $('.submit-feedback-container', this.$element);
	try {
		this.validate($form);
	}
	catch (e) {
		Validator.handleValidationException(e);
		return;
	}

	ValidatorDemo.Tools.showAlert({content: '<i class="glyphicon glyphicon-ok"></i> OK'}, $alertContainer);
};

ValidatorDemo.Tools = {
	showAlert: function (options, $container) {
		var $alert,
				  templateId = 'alert-template';
		options = $.extend({}, options);
		$alert = Tools.Template.render(templateId, options);
		$container.find('.alert').remove();
		$container.append($alert);
	}
};

(function(){
	var $form = $('#form'),
			  form = new ValidatorDemo.Form({$element: $form});

	$form.submit(function (event) {
		event.preventDefault();
		form.submit();
	});
}());