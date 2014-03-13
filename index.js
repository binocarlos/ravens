var simple_recaptcha = require('simple-recaptcha');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var path = require('path');

function Ravens(options){
	this.options = options;
	EventEmitter.call(this);

	this.privateKey = options.recaptcha_private_key;
	this.publicKey = options.recaptcha_public_key;
}

util.inherits(Ravens, EventEmitter);

Ravens.prototype.handler = function(){
	var self = this;
	return function(req, res){
		self.process(req.ip, req.body, function(error){
			if(error){
				res.json({
					ok:false,
					error:error
				});
			}
			else{
				res.json({
					ok:true
				})
			}
		})
	}
}

Ravens.prototype.process = function(ip, formdata, callback){
	var self = this;
	formdata = formdata || {};

  var challenge = formdata.recaptcha_challenge_field;
  var response = formdata.recaptcha_response_field;

  var error_string = null;

  if(!challenge || !response){
  	error_string = 'Please fillout the captcha correctly';
  }

/*
  ['email', 'name', 'subject', 'message'].forEach(function(f){
  	var val = formdata[f];

  	if(!val){
  		error_string = 'please enter a ' + f + ' string';
  	}
  })
*/

  if(error_string){
  	callback(error_string);
  	return;
  }

  simple_recaptcha(self.privateKey, ip, challenge, response, function(err) {

  	if (err){
    	return callback('The Captcha was entered incorrectly.  Please try again');
    }

    self.emit('send', formdata);
    callback();
    
  })
}

module.exports = function(options){

	if(!options.recaptcha_public_key){
		throw new Error('recaptcha_public_key required');
	}

	if(!options.recaptcha_private_key){
		throw new Error('recaptcha_private_key required');
	}

	return new Ravens(options);
}