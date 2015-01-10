# express-authentication-params

Authenticate against any express request properties, compatible with [express-authentication].

![build status](http://img.shields.io/travis/izaakschroeder/express-authentication-params/master.svg?style=flat)
![coverage](http://img.shields.io/coveralls/izaakschroeder/express-authentication-params/master.svg?style=flat)
![license](http://img.shields.io/npm/l/express-authentication-params.svg?style=flat)
![version](http://img.shields.io/npm/v/express-authentication-params.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/express-authentication-params.svg?style=flat)

```javascript
var params = require('express-authentication-params'),
	auth = require('express-authentication');

// Validate the challenge
app.use(params({
	properties: [ 'access_key' ],
	verify: function(challenge, callback) {
		callback(null, challenge.access_key === 'secret');
	}
}));

// Try ?access_key=secret!
app.get('/', auth.required(), function(req, res) {
	res.status(200).send('Hello world.');
});

```

[express-authentication]: https://github.com/izaakschroeder/express-authentication
