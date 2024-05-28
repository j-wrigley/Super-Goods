<Meta/>

<script>
    import Meta from "../components/Meta.svelte";
</script>

<style>
    @font-face {
        font-family: 'Junicode';
        src: url('../fonts/Junicode.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
        text-decoration: none;
        -webkit-font-smoothing: antialiased;
        font-synthesis: none;
        text-rendering: optimizeLegibility;
    }
    
    /* Root Styling & Resets */
    * {
        color: #FF0000;
    }
    
    </style>
    
    <div class="siteContainer">
        <!-- Main Page -->
        <slot></slot>
    </div>