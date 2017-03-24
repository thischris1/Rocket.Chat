Accounts.registerLoginHandler('totp', function(options) {
	if (!options.totp || !options.totp.code) {
		return;
	}

	return Accounts._runLoginHandlers(this, options.totp.login);
});

RocketChat.callbacks.add('onValidateLogin', (login) => {
	if (login.type === 'password' && login.user.services && login.user.services.totp && login.user.services.totp.enabled === true) {
		const { totp } = login.methodArguments[0];

		if (!totp || !totp.code) {
			throw new Meteor.Error('totp-required', 'TOTP Required');
		}

		const verified = RocketChat.TOTP.verify(login.user.services.totp.secret, totp.code);

		if (verified !== true) {
			throw new Meteor.Error('totp-invalid', 'TOTP Invalid');
		}
	}
});
