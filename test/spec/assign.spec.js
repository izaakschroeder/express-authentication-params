
'use strict';

var express = require('express'),
	bodyParser = require('body-parser'),
	request = require('supertest'),
	assign = require('assign');

describe('#assign', function() {
	beforeEach(function() {
		var app = express(),
			middleware = assign({
				properties: [ 'foo' ]
			});

		app.use(bodyParser.json());
		app.use(middleware);
		this.app = app;
	});

	it('should fail with no properties', function() {
		expect(assign).to.throw(TypeError);
	});

	it('should fail if `options.parse` is not a function', function() {
		expect(function() {
			assign({ properties: ['test'], parse: true });
		}).to.throw(TypeError);
	});

	it('should populate `req.challenge`', function(done) {
		this.app.use(function(req, res) {
			res.status(200).send(req.challenge);
		});
		request(this.app)
			.get('/')
			.query({ foo: 'abc' })
			.expect(function(res) {
				expect(res.body).to.have.property('foo', 'abc');
			})
			.end(done);
	});

	it('should skip if no properties match', function(done) {
		var app = express(),
			stub = sinon.stub();
		app.use(assign({ properties: ['foo'], parse: stub }));
		request(app)
			.get('/')
			.expect(function() {
				expect(stub).to.not.be.called;
			})
			.end(done);
	});

	it('should fail if only some properties match', function(done) {
		var app = express();
		app.use(assign({ properties: ['foo', 'bar'] }));
		request(app)
			.get('/')
			.query({ foo: 'abc' })
			.expect(function(res) {
				expect(res.statusCode).to.equal(400);
			})
			.end(done);
	});

	it('should use `options.parse` for `req.challenge`', function(done) {
		var app = express(),
			stub = sinon.stub();
		app.use(assign({ properties: ['foo'], parse: stub }));
		request(app)
			.get('/')
			.query({ foo: 'abc' })
			.expect(function() {
				expect(stub).to.be.calledOnce
					.and.be.calledWithMatch({ foo: 'abc' });
			})
			.end(done);
	});


	it('should fail if multiple values match', function(done) {
		request(this.app)
			.get('/')
			.query({ foo: 'abc' })
			.send({ foo: '123' })
			.expect(function(res) {
				expect(res.statusCode).to.equal(400);
			})
			.end(done);
	});

	it('should fail if a challenge is already set', function(done) {
		var app = express();
		app.use(function(req, res, next) {
			req.challenge = 'foo';
			next();
		});
		app.use(assign({
			properties: [ 'foo' ]
		}));
		request(app)
			.get('/')
			.query('foo', 'abc')
			.expect(function(res) {
				expect(res.statusCode).to.equal(500);
			})
			.end(done);
	});
});
