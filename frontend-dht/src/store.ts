import { writable, derived } from "svelte/store";
import type { User } from '$types/User';
import type { Writable } from "svelte/store";

export const isAuthenticated = writable(false);

export const user: Writable<User> = writable({ });

export const popupOpen = writable(false);
export const error = writable();