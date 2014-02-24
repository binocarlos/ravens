var HTMLInclude = require('../');
var express = require('express');
var http = require('http');
var request = require('request');


describe('html-include', function(){


	describe('factory', function(){

		it('should be a function', function(){

			HTMLInclude.should.be.type('function');

		})

		it('should throw without document_root', function(){
			(function(){
			  var includes = HTMLInclude();
			}).should.throw();
		})

		it('should not throw with options', function(){
			(function(){
			  var includes = HTMLInclude({
		  		document_root:__dirname + '/www'
			  });
			}).should.not.throw();
		})


	})

	describe('server', function(){

		var app;
		var server;
		before(function(done){
			var includes = HTMLInclude({
				document_root:__dirname + '/www',
				priority:'page'
			})

			includes.on('page', function(filepath, vars, done){
				if(filepath.match(/^\/apples/)){
					vars.amount = 34;
					vars.citrus = 12;
				}
				else if(filepath.match(/^\/async/)){
					vars._async = true;

					setTimeout(function(){
						vars.async = 39;
						done();
					}, 100)

				}
			})
			app = express();
			includes.setup(app);
			app.use(includes.serve);
			server = http.createServer(app);
			server.listen(8000, done);
		})

		it('should serve the homepage', function(done){
			this.timeout(1000);

			request.get('http://127.0.0.1:8000/', function(error, res, html){
				res.statusCode.should.equal(200);
				html.should.equal('hello world');
				done();
			})
		})

		it('should serve pages over directory indexes', function(done){
			this.timeout(1000);

			request.get('http://127.0.0.1:8000/about', function(error, res, html){
				res.statusCode.should.equal(200);
				html.should.equal('about');
				done();
			})
		})		

		it('should serve directory indexes when asked', function(done){
			this.timeout(1000);

			request.get('http://127.0.0.1:8000/about/index.html', function(error, res, html){
				res.statusCode.should.equal(200);
				html.should.equal('aboutindex');
				done();
			})
		})

		it('should serve pages if no directory exists', function(done){
			this.timeout(1000);

			request.get('http://127.0.0.1:8000/contact', function(error, res, html){
				res.statusCode.should.equal(200);
				html.should.equal('contact');
				done();
			})
		})			

		it('should serve includes', function(done){
			this.timeout(1000);

			request.get('http://127.0.0.1:8000/includes.html', function(error, res, html){
				res.statusCode.should.equal(200);
				html.should.equal("HEADER\n\nhello world\n\nFOOTER");
				done();
			})
		})


		it('should render values into pages and includes', function(done){
			this.timeout(1000);

			request.get('http://127.0.0.1:8000/apples', function(error, res, html){
				res.statusCode.should.equal(200);
				html.should.equal("34 apples\n12 citrus");
				done();
			})
		})

		it('should allow async values', function(done){
			this.timeout(1000);

			request.get('http://127.0.0.1:8000/async', function(error, res, html){
				res.statusCode.should.equal(200);
				html.should.equal("39 async");
				done();
			})
		})
	})
})