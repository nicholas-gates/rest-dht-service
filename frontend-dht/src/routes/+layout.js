import auth from "../authService";
// import { isAuthenticated, user } from "../store";

/** @type {import('./$types').LayoutLoad} */
export async function load({ params }) {

    if (typeof window !== 'undefined') {
        const auth0Client = await auth.createClient();

        auth.setUserDetails(auth0Client);

        return {
            auth0Client, // make the client available to the app
        };
    }

}