<script>
    /**
     * Whether to render the button as just an outline with no background
     * @type {boolean}
     */
    export let outline = false;

    /**
     * The link the button refers to
     *
     * When set, the button will behave like an <a> tag
     * @type {?String}
     */
    export let href = null;

    /**
     * Custom classes to add to the component
     * @type {String}
     */
    export let className = "";

    /**
     * The size of the button
     * @type {"sm" | "md" | "lg"}
     */
    export let size = "md";

    /**
     * The colour of the button
     *
     * Should be set to either a colour type, or a valid css colour
     * @type {"primary" | "secondary" | "success" | "warning" | "error" | "surface" | "contrast"}
     */
    export let colour = "primary";

    /**
     * The type of the button
     * Does nothing if the component has a href
     * @type {"button" | "submit" | "reset"}
     */
    export let type = "button";

    /**
     * Whether this button is disabled
     *
     * Does not work when a link
     * @type {boolean}
     */
    export let disabled = false;

    let classList = "";

    $: {
        // let colourName = ["primary", "secondary", "success", "warning", "error", "surface"].includes(colour)
        //     ? colour
        //     : "custom-colour";
        let colourName = colour;
        if (outline) colourName += "-outline";

        classList =`${size} ${colourName} ${colour}-hover`
        if (className) classList += ` ${className}`;
    }
</script>

{#if href}
    <a class="{classList}" {href}>
        <slot/>
    </a>
{:else}
    <button class="{classList}" {type} {disabled} on:click>
        <slot/>
    </button>
{/if}

<style lang="less">
    button {
      border: unset;
    }
    a, button {
      display: flex;
      align-items: center;
      justify-content: center;

      cursor: pointer;

      border-radius: var(--theme-container-round);
      padding: 15px 10px;

      &.md {
        height: 50px;
        min-width: 50px;
      }

      &:not(:disabled):active {
        transform: translateY(2px);
      }
    }
</style>
