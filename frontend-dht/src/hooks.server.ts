import { setSession } from '$houdini'

/* @type { import('@sveltejs/kit').Handle } */
export const handle = async ({ event, resolve }) => {

    // console.log('⭐️⭐️⭐️ event', event);

    // get the user information however you want
    // const user = await authenticateUser(event)

    // console.log('⭐️⭐️⭐️ user', user);

    // set the session information for this event
    // setSession(event, { user })

    // pass the event onto the default handle
    return await resolve(event)
}

// const authenticateUser = async (event) => {

//     const fdbtoken = event.cookies.get('fdbtoken');

//     return {
//         token: fdbtoken,
//     }
// }