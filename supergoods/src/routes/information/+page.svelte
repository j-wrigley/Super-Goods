<script>
    import { onMount } from 'svelte';
    import Navbar from "../../components/Navbar.svelte";
    import '../../components/MainStyles.css';

    let data = { contents: [] };
    let currentPage = 1;
    let itemsPer = 10;
    let channel = "super-goods-information";
    let isLoading = false;
    let allDataLoaded = false;

    async function fetchData(page) {
        if (allDataLoaded || isLoading) return;
        isLoading = true;
        
        // Add cache-busting parameter
        const cacheBuster = new Date().getTime();
        const apiUrl = `https://api.are.na/v2/channels/${channel}?page=${page}&per=${itemsPer}&cache_buster=${cacheBuster}`;
        
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Cache-Control": "no-cache"
            }
        });

        if (response.ok) {
            const newData = await response.json();
            if (newData.contents.length < itemsPer) {
                allDataLoaded = true;
            }
            if (page === 1) {
                data = newData;
            } else {
                data.contents = [...data.contents, ...newData.contents];
            }
        } else {
            console.error("Failed to load the channel.");
        }
        isLoading = false;
    }

    function handleScroll() {
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        const scrolledToBottom = scrollTop + window.innerHeight + 100 >= scrollHeight;
        if (scrolledToBottom && !isLoading) {
            currentPage++;
            fetchData(currentPage);
        }
    }

    onMount(() => {
        window.addEventListener("scroll", handleScroll);
        fetchData(currentPage);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    });
</script>


<style>
    .siteAbout {
        padding-top: 8px;
    }
</style>

{#if data}
<!-- Site Description Block -->
<div class="site-info-container">
    {#if data}
    <!-- Site Description Left -->
    <div class="juni-24">
        {#if data.metadata && data.metadata.description}
            <p>{data.metadata.description}</p>
        {/if}
    </div>

    <div class="site-navbar-info">
        <Navbar/>
    </div>


    {#each data.contents as content}
        {#if content.content_html}
            <div class="site-info-content juni-18">
                {@html content.content_html}
            </div>
        {/if}
    {/each}

    {:else}
        <p class="juni-18">Loading...</p>
    {/if}
</div>

<section class="site-info-links juni-18">
    <p class=""><a class="clear-link" href="https://www.are.na/james-wrigley-1496425668/super-goods-lhev24-ol-y">Are.na</a></p>
    <p class=""><a class="clear-link" href="https://github.com/j-wrigley/Super-Goods">GitHub</a></p>
    <p class=""><a class="clear-link" href="https://www.instagram.com/supergoods.today/">Instagram</a></p>
    <p class=""><a class="clear-link" href="https://www.threads.net/@supergoods.today">Threads</a></p>
    <p class=""><a class="clear-link" href="https://super-goods.beehiiv.com/subscribe">Newsletter</a></p>
</section>

{:else}
    <p>Loading...</p>
{/if}