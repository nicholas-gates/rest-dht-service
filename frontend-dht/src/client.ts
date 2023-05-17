import { HoudiniClient } from '$houdini';

// console.log(`⭐️⭐️⭐️ creating HoudiniClient`);

export default new HoudiniClient({
	url: 'https://graphql.us.fauna.com/graphql',
	fetchParams() {
		let token;
		if (typeof window !== 'undefined') {
			const token = localStorage.getItem('fdbtoken');
			// console.log(`⭐️⭐️⭐️ token: `, token);
			// if (!token) {
			// 	throw new Error('No token found');
			// }

			return {
				headers: {
					Authorization: `Bearer ${token}`,
				}
			};
		}
		return {};
	}
});
