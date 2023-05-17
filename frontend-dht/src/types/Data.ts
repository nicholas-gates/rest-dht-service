import type { Auth0Client, User } from '@auth0/auth0-spa-js';
import type { Writable } from 'houdini/build/runtime/lib';

export interface Data {
	auth0Client: Auth0Client;
	isAuthenticated: Writable<boolean>;
	user: Writable<User>;
}
