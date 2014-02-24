ravens
======

node.js contact form handler using Mailgun and ReCaptcha

## installation

```
$ npm install ravens
```

## usage

```js
var Ravens = require('ravens');

var ravens = Ravens({
	recaptcha_public_key:'...',
	recaptcha_private_key:'...',
	mailgun_domain:'...',
	mailgun_key:'...'
})

var app = express();

// mount the form submit route onto the express application
app.use('/contactsubmit', ravens.handler);
```

## Ravens(appconfig)

create a new express handler with the following properties:

 * recaptcha_public_key - the public key for your recaptcha account
 * recaptcha_private_key - the private key for your recaptcha account 
 * mailgun_domain - the domain for your mailgun account
 * mailgun_key - the key for your mailgun account
 * emails - an array of emails to send the contact form submissions to

## events

these events are emitted by a ravens instance:

### form

```js
var ravens = Ravens({...});

ravens.on('form', function(formdata){
	formdata.extradata = 'this is the extra data';
})

```


