
'use strict';

var params = require('params');

describe('params', function() {
	it('should return a function', function() {
		expect(params({
			properties: { foo: true },
			verify: function() { }
		})).to.be.instanceof(Function);
	});
});
