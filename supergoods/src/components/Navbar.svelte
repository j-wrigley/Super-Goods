<script>
    import { Link } from 'svelte-routing';
</script>

<style>
    /* Page Styling */
    .siteNav {
        display: flex;
        padding-bottom: 12px;
        border-bottom: 0.5px solid;
    }
    .navButton {
        background-color: transparent;
        color: inherit;
        border: none;
        padding: 0px 8px 0px 0px;
        margin: 0;
        font: inherit;
        cursor: pointer;
        outline: none;
        text-align: left;
        text-decoration: none;
    }
</style>

<div class="siteNav base-text-n">
    <button class="navButton"><a href="/">Home</a></button>
    <button class="navButton"><a href="/information">Information</a></button>
    <button class="navButton"><a href="https://super-goods.beehiiv.com/subscribe">Newsletter</a></button>
</div>