var simple_recaptcha = require('simple-recaptcha');
var TextMail = require('textmail');

module.exports = function(options){

	if(!options.recaptcha_public_key){
		throw new Error('recaptcha_public_key required');
	}

	if(!options.recaptcha_private_key){
		throw new Error('recaptcha_private_key required');
	}

	if(!options.mailgun_domain){
		throw new Error('mailgun_domain required');
	}

	if(!options.mailgun_key){
		throw new Error('mailgun_key required');
	}

	if(!options.emails){
		throw new Error('emails required');
	}

	var mailer = TextMail({
		domain:options.mailgun_domain,
		key:options.mailgun_key,
		template_root:__dirname + '/templates'
	})

	var contactmail = mailer.create('/contact.ejs', 'Contact Form Submission', options.emails);
	var privateKey = options.recaptcha_private_key;

	return function(ip, formdata, callback){

		formdata = formdata || {};

	  var challenge = formdata.recaptcha_challenge_field;
	  var response = formdata.recaptcha_response_field;

	  var error_string = null;

	  if(!challenge || !response){
	  	error_string = 'Please fillout the captcha';
	  }

	  ['email', 'name', 'subject', 'message'].forEach(function(f){
	  	var val = formdata[f];

	  	if(!val){
	  		error_string = 'please enter a ' + f + ' string';
	  	}
	  })

	  if(error_string){
	  	callback(error_string);
	  	return;
	  }

	  simple_recaptcha(privateKey, ip, challenge, response, function(err) {

	  	if (err){
	    	return callback('The Captcha was entered incorrectly.  Please try again');
	    }
	    
	  	contactmail(formdata.email, formdata, callback);

	  })
	}
}