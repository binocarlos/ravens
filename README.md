ravens
======

node.js contact form handler using ReCaptcha

## installation

```
$ npm install ravens
```

## usage

```js
var Ravens = require('ravens');

var ravens = Ravens({
	recaptcha_public_key:'...',
	recaptcha_private_key:'...'
})

ravens.on('send', function(formdata){

	// this formdata has been validated by ReCaptcha
	// you can use it to send an email or do whatever

})

var app = express();

// mount the form submit route onto the express application
app.use('/contactsubmit', ravens.handler());
```

## Ravens(appconfig)

create a new express handler with the following properties:

 * recaptcha_public_key - the public key for your recaptcha account
 * recaptcha_private_key - the private key for your recaptcha account 

## events

these events are emitted by a ravens instance:

### emit('send', formdata)

gives a chance to mess with the formdata before the emails are sent

## form data

When you submit formdata to the handler - the request body must be JSON and must contain the following fields:

 * recaptcha_challenge_field
 * recaptcha_response_field

These are acquired by using the [ReCaptcha client libraries](https://www.google.com/recaptcha/admin/create).

There is an angular plugin for Ravens that renders a nice contact form with Recaptcha Plugin built in - [ng-ravens](https://github.com/binocarlos/ng-ravens).

### license

MIT