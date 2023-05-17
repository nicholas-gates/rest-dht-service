<script lang="ts">
	import type { User } from '$types/User';

	import auth from '$home/authService';
	import type { Writable } from '$houdini';
	import type {Data} from '$types/Data';

	// interface PageStores {
	// 	user: Writable<User | null>;
	// 	isAuthenticated: Writable<boolean>;
	// }

	import { user, isAuthenticated  } from '$home/store';

	export let data: Data;
	// console.log(`⭐️⭐️⭐️ layout data `, data);
	// console.log(`⭐️⭐️⭐️ layout user `, user);
	// console.log(`⭐️⭐️⭐️ layout isAuthenticated `, isAuthenticated);

	const { auth0Client }: Data = data;

	function login() {
		if (auth0Client) {
			auth.loginWithPopup(auth0Client, {
				authorizationParams: {
					audience: 'https://db.fauna.com/db/yu6n7xsjsyrfc',
					scope: 'openid profile email'
				}
			});
		}
	}

	function logout() {
		if (auth0Client) {
			auth.logout(auth0Client);
		}
	}
</script>

<main>
	<!-- App Bar -->
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<a class="navbar-brand" href="/#">Task Manager</a>
		<button
			class="navbar-toggler"
			type="button"
			data-toggle="collapse"
			data-target="#navbarText"
			aria-controls="navbarText"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon" />
		</button>
		<div class="collapse navbar-collapse" id="navbarText">
			<div class="navbar-nav mr-auto user-details">
				{#if $isAuthenticated}
					<span class="text-white">&nbsp;&nbsp;{$user?.name} ({$user?.email})</span>
				{:else}<span>&nbsp;</span>{/if}
			</div>
			<span class="navbar-text">
				<ul class="navbar-nav float-right">
					{#if $isAuthenticated}
						<li class="nav-item">
							<a class="nav-link" href="/#" on:click={logout}>Log Out</a>
						</li>
					{:else}
						<li class="nav-item">
							<a class="nav-link" href="/#" on:click={login}>Log In</a>
						</li>
					{/if}
				</ul>
			</span>
		</div>
	</nav>
	<slot />
</main>
