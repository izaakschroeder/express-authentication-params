
'use strict';

var _ = require('lodash');

module.exports = function create(options) {

	// Defaults
	options = _.assign({
		sources: [ 'query', 'body' ],
		get: function getByParam(req, param) {
			function check(source) {
				return _.has(req[source], param);
			}
			var sources = options.sources,
				first = _.find(sources, check),
				last = _.findLast(sources, check);
			if (first) {
				if (first !== last) {
					throw _.defaults(new Error(), {
						status: 400,
						error: 'AMBIGUOUS_PROPERTY',
						property: param
					});
				} else {
					return req[first][param];
				}
			}
		},
		properties: { },
		parse: _.identity
	}, options);


	// Sanity
	if (_.isEmpty(options.properties)) {
		throw new TypeError('`options.properties` must have some entries.');
	} else if (!_.isFunction(options.parse)) {
		throw new TypeError('`options.parse` must be valid function.');
	}

	var keys = options.properties;

	return function assignMiddleware(req, res, next) {

		// Don't interfere with other middleware
		if (req.challenge) {
			return next({ error: 'CHALLENGE_SET' });
		}

		var challenge = _.zipObject(keys, _.map(keys, function get(key) {
			return options.get(req, key);
		}));

		var missing = _.filter(keys, function checkMissing(key) {
			return _.isUndefined(challenge[key]);
		});

		if (missing.length === keys.length) {
			next();
		} else if (missing.length > 0) {
			next({ status: 400, error: 'MISSING_PROPERTIES' });
		} else {
			req.challenge = options.parse(challenge);
			next();
		}

	};
};
