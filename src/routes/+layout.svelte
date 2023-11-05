<script>
    import SvgIcon from '@jamescoyle/svelte-icon';
    import { mdiHome, mdiFloorPlan, mdiLan } from '@mdi/js';
</script>

<nav>
    <a href="/"><SvgIcon type="mdi" path="{mdiHome}"/> Home</a>
    <a href="/phyiscal"><SvgIcon type="mdi" path="{mdiFloorPlan}"/> Floor Plan</a>
    <a href="/logical"><SvgIcon type="mdi" path="{mdiLan}"/> Logical Map</a>
</nav>

<slot></slot>

<style lang="less">
    nav {
      display: flex;
      align-content: flex-start;

      border-bottom: 1px black solid;

      a {
        display: flex;
        align-items: center;

        min-width: 50px;
        height: 50px;
        text-align: center;

        padding: 5px 20px;

        line-height: 3;
        text-decoration: none;
        color: black;

        &:hover {
          background-color: lightgrey;
        }

        &:visited {
          color: unset;
        }
      }
    }

    :global(body, html) {
      width: 100%;
      height: 100%;
      margin: 0;
      border: 0;
      padding: 0;
    }

    :global(body) {
      display: flex;
      flex-direction: column;
      position: relative;
    }
</style>
