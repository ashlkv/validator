#About
Exceptions-based JavaScript validation tool. Comes with Bootstrap adapter. Requires jQuery.

#Installation
Include validator.js and adapter both .js and .css files on your web page.

#Usage example
```
try {
	Validator.validateRequired($('[name="firstName"]'), 'First name must be specified');
}
catch (e) {
	Validator.handleValidationException(e);
	return;
}
```
