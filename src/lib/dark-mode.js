import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Update the document class for the new value of dark mode.
 * @param darkMode {boolean} Whether dark mode is enabled or not
 */
function updateDocumentTheme(darkMode) {
    localStorage.setItem("theme", darkMode ? "dark" : "light")
    darkMode
        ? document.documentElement.classList.add('dark-mode')
        : document.documentElement.classList.remove('dark-mode');
}

let darkPreferred = false;
if (browser) {
    darkPreferred = localStorage.getItem("theme") === "dark" || (!"theme" in localStorage)
        && window.matchMedia("(prefers-color-scheme: dark)").matches;

    updateDocumentTheme(darkPreferred);
}


/**
 * Create a store for the dark mode toggler
 * @return {{subscribe: (this:void, run: Subscriber<boolean>, invalidate?: Invalidator<boolean>) => Unsubscriber, toggle: (function(): void)}}
 */
function createDarkMode() {
    const {subscribe, set, update} = writable(darkPreferred);

    return {
        subscribe,
        toggle: () => update((darkMode) => {
            darkMode = !darkMode;

            updateDocumentTheme(darkMode);

            return darkMode;
        }),
        set: (darkMode) => update(() => {
            updateDocumentTheme(darkMode);

            return darkMode;
        })
    }
}

export const darkMode = createDarkMode();
