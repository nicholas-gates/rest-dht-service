<script lang="ts">
	// import type { User } from '$types/User';

	import auth from '$home/authService';
	// import type { Writable } from '$houdini';
	import type { Data } from '$types/Data';

	// interface PageStores {
	// 	user: Writable<User | null>;
	// 	isAuthenticated: Writable<boolean>;
	// }

	import { user, isAuthenticated } from '$home/store';

	import '@picocss/pico';
	// import '../app.css';

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

	<header class="container">
		<hgroup>
			<h1>DHT Readings</h1>
			<h2>View digital humidity and temperature readings over time.</h2>
		</hgroup>
		<nav>
			<ul>
				<li>
					<details role="list">
						<summary aria-haspopup="listbox" role="button" class="secondary">Menu</summary>
						<ul role="listbox">
							<li><a href="/" data-theme-switcher="auto">Home</a></li>
							<li><a href="/dht" data-theme-switcher="auto">DHT Readings</a></li>

							{#if $isAuthenticated}
								<li>
									<a href="/#" data-theme-switcher="auto" on:click={logout}>Log Out</a>
								</li>
							{:else}
								<li>
									<a href="/#" data-theme-switcher="auto" on:click={login}>Log In</a>
								</li>
							{/if}
						</ul>
					</details>
				</li>
				<!-- <li>
					<details role="list">
						<summary aria-haspopup="listbox">Examples (v1)</summary>
						<ul role="listbox">
							<li><a href="../v1-preview/">Preview</a></li>
							<li><a href="../v1-preview-rtl/">Right-to-left</a></li>
							<li><a href="../v1-classless/">Classless</a></li>
							<li><a href="../v1-basic-template/">Basic template</a></li>
							<li><a href="../v1-company/">Company</a></li>
							<li><a href="../v1-google-amp/">Google Amp</a></li>
							<li><a href="../v1-sign-in/">Sign in</a></li>
							<li><a href="../v1-bootstrap-grid/">Bootstrap grid</a></li>
						</ul>
					</details>
				</li> -->
				<li>
					{#if $isAuthenticated}
						<a href="/#" data-theme-switcher="auto" on:click={logout}>Log Out</a>
					{:else}
						<a href="/#" data-theme-switcher="auto" on:click={login}>Log In</a>
					{/if}
				</li>

				{#if $isAuthenticated}
					<span class="text-white">&nbsp;&nbsp;{$user?.name} ({$user?.email})</span>
				{:else}<span>&nbsp;</span>{/if}

			</ul>
		</nav>
	</header>


	<slot />
</main>
