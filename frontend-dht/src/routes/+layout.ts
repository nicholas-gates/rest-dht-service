import auth from "../authService";

/** @type {import('./$types').LayoutLoad} */
export async function load() {

    if (typeof window !== 'undefined') {
        const auth0Client = await auth.createClient();

        auth.setUserDetails(auth0Client);

        return {
            auth0Client, // make the client available to the app
        };
    }

}