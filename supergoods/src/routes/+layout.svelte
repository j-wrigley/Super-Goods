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
    
    :global(::-webkit-scrollbar, .scrollable-content::-webkit-scrollbar) {
        width: 8px;
        height: 8px;
        background-color: #fff; 
        border-radius: 0px; 
        border: 0.5px solid #FF0000;
    }
    
    :global(::-webkit-scrollbar-thumb, .scrollable-content::-webkit-scrollbar-thumb) {
        background-color: #FF0000;
        border-radius: 0px;
    }
    
    :global(::-webkit-scrollbar-track, .scrollable-content::-webkit-scrollbar-track) {
        box-shadow: none;
        border-radius: 10px;
    }
    
    :global(.siteTitle p) {
        font-family: 'Junicode';
        font-size: 76px;
        text-align: left;
        padding: 14px 0px 0px 0px;
        line-height: 0.9em;
        margin: 0px 0px 280px 0px;
    }
    :global(.lg-text-n){
        font-family: neue-haas-grotesk-display, sans-serif; 
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }
    :global(.base-text-n){
        font-family: neue-haas-grotesk-display, sans-serif; 
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }
    :global(.sm-text-n){
        font-family: neue-haas-grotesk-display, sans-serif; 
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
    }
    :global(.xs-text-n){
        font-family: neue-haas-grotesk-display, sans-serif; 
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        opacity: 0.5;
    }
    :global(.xl4-text-n){
        font-family: neue-haas-grotesk-display, sans-serif; 
        font-size: 24px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
    }
    
    :global(p) {
        padding: 0;
        margin: 0;
    }
    
    :global(.sg-button a) {
        text-decoration: none;
        color: inherit;
        transition: 0.2s all;
    }
    :global(.sg-button a:hover) {
        opacity: 1;
    }
    
    :global(a) {
        text-decoration: none;
        color: inherit;
        transition: 0.2s all;
    }
    :global(a:hover) {
        opacity: 0.5;
        text-decoration: none;
        color: inherit;
        transition: 0.2s all;
    }
    
    :global(.siteDescription) {
        position: sticky;
        top: 0px;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        margin-bottom: 48px;
        padding-top: 12px;
        padding-bottom: 8px;
        z-index: 9;
    }
    :global(.siteDescription-left p) {
        text-align: left;
        padding: 0;
        margin: 0;
        width: 60%;
    }
    :global(.siteDescription-right p) {
        text-align: right;
        padding: 0;
        margin: 0;
    }
    
    /* Page Styling */
    .siteContainer {
        margin: 24px;
    }
    
    @media (max-width: 768px) {
        .siteContainer {
            margin: 8px;
        }
        :global(.siteTitle p) {
            font-size: 18.3vw;
        }
    }
    </style>
    
    <div class="siteContainer">
        <!-- Main Page -->
        <slot></slot>
    </div>