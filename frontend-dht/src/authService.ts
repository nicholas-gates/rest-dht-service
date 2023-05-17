import { createAuth0Client, Auth0Client, type PopupLoginOptions } from '@auth0/auth0-spa-js';
import { user, isAuthenticated, popupOpen } from './store';
import config from '../auth_config';

async function createClient() {
	let auth0Client = await createAuth0Client({
		domain: config.domain,
		clientId: config.clientId,
		cacheLocation: 'localstorage',
		useRefreshTokens: true
	});

	return auth0Client;
}

async function loginWithPopup(authClient: Auth0Client, options: PopupLoginOptions) {
	popupOpen.set(true);
	// console.log(`options: ${JSON.stringify(options)}`);

	try {
		await authClient.loginWithPopup(options);

		setUserDetails(authClient);
	} catch (e) {
		// eslint-disable-next-line
		console.error(e);
	} finally {
		popupOpen.set(false);
	}
}

function logout(authClient: Auth0Client) {
	// document.cookie = `fdbtoken=; Secure`;
	localStorage.removeItem('fdbtoken');
	return authClient.logout();
}

const setUserDetails = async (authClient: Auth0Client) => {
	const authuser = await authClient.getUser();
	console.log(`⭐️⭐️⭐️ authuser: ${JSON.stringify(authuser)}`);

	if (!authuser) {
		console.log(`⭐️⭐️⭐️ !authuser`);

		user.set({});
		isAuthenticated.set(false);

		return;
	}

	const differentAudienceOptions = {
		authorizationParams: {
			audience: 'https://db.fauna.com/db/yu6n7xsjsyrfc'
		}
	};

	const faunaToken = await authClient.getTokenSilently(differentAudienceOptions);

	// document.cookie = `fdbtoken=${faunaToken}; Secure`;
	localStorage.setItem('fdbtoken', faunaToken);
	authuser.faunaToken = faunaToken;

	user.set(authuser);
	isAuthenticated.set(true);

	console.log(`⭐️⭐️⭐️ setUserDetails`, {
		user,
		isAuthenticated
	});
};

const auth = {
	setUserDetails,
	createClient,
	loginWithPopup,
	logout
};

export default auth;
