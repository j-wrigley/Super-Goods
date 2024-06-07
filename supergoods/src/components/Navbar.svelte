<script>
    import { Link } from 'svelte-routing';
</script>

<style>
    /* Page Styling */
    .site-navbar {
        display: flex;
        padding-bottom: 12px;
        justify-content: space-between;
    }
    .nav-button {
        text-transform: uppercase;
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
    /* ============ Media Screen Sizes ============ */
    @media only screen and (max-width: 680px) {
        .site-navbar {
            flex-wrap: wrap;
        }
        .nav-button {
            padding: 0px;
            font-size: 90%;
        }
        .site-navbar:last-child {
            margin-left: auto;
        }
        .site-navbar:last-child a {
            padding-right: 0px !important;
        }
    }
</style>

<div class="site-navbar juni-14">
    <button class="nav-button"><a class="clear-link" href="/">Home</a></button>
    <button class="nav-button"><a class="clear-link" href="/information">Information</a></button>
    <button class="nav-button"><a class="clear-link" href="/moodboard">Moodbaord</a></button>
    <button class="nav-button"><a class="clear-link" href="https://super-goods.beehiiv.com/subscribe">Newsletter</a></button>
</div>