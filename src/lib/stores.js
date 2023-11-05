import { writable } from 'svelte/store';

function createIgnoreForwards() {
    const {subscribe, set, update} = writable(true);

    return {
        subscribe,
        toggle: () => update((n) => !n)
    }
}

export const ignoreForwards = createIgnoreForwards();
