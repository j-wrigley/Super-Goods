<script>
    import Navbar from "../../components/Navbar.svelte";
    import { onMount } from 'svelte';
    
    let data = { contents: [] };
    let currentPage = 1;
    let itemsPer = 10;
    let channel = "super-goods-lhev24-ol-y";
    let isLoading = false;
    let allDataLoaded = false;

    async function fetchData(page) {
        if (allDataLoaded || isLoading) return;
        isLoading = true;
        const apiUrl = `https://api.are.na/v2/channels/${channel}?page=${page}&per=${itemsPer}`;
        const response = await fetch(apiUrl, { method: "GET" });
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
        console.log("Scroll event fired");
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        const scrolledToBottom = scrollTop + window.innerHeight + 100 >= scrollHeight;
        if (scrolledToBottom && !isLoading) {
            console.log("Bottom reached, loading more content");
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

    function formatUrl(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `http://${url}`;
        }
        return url;
    }
</script>

<style>
    .siteAbout {
        padding-top: 8px;
    }
</style>

<!-- Loading Splash Page -->
{#if isLoading}
    <div class="loadingDiv">
        <div class="loadingSymbol siteTitle">☞</div> <!-- EDIT HERE -->
    </div>
{/if}

{#if data}
<!-- Site Title -->
<div class="siteTitle">
    {#if data.title}
        <p>{data.title}</p>
    {/if}
</div>

<!-- Site Description Block -->
<div class="siteDescription base-text-n">
    {#if data}
    <!-- Site Description Left -->
    <div class="siteDescription-left">
        {#if data.metadata && data.metadata.description}
            <p>{data.metadata.description}</p>
        {/if}
    </div>

    <!-- Site Description Right -->
    <div class="siteDescription-right">
        {#if data.created_at && data.length}
            <p>Powered by Are.na</p>
            <p>Created at : {data.created_at}</p>
            <p>Length : {data.length}</p>
        {/if}
    </div>
    
    {:else}
        <p class="base-text-n">Loading...</p>
    {/if}
</div>

<Navbar/>

<section class="siteAbout">
    <p class="xl4-text-n">A collection of super good links from across the internet. This project brings together some of the best links on design, visual communciation, photography, digital culure and more, sharing articles, websites, tools and software to inform and inspire. Super~Goods is a completly open source project, from the code to the content, everything is freely availble online. Powered by Are.na, you can choose to follow the channel, fork a copy of the site and create your own super good site to share you links and create you own version of this project, you can find the full code for this project over on GitHub. Super~Goods also has a newsletter, delivering the latest picks directly to your inbox, so if you prefer to keep updated that way, please consider joining.</p>
    <p><a href="https://www.are.na/james-wrigley-1496425668/super-goods-lhev24-ol-y">Are.na</a></p>
    <p><a href="https://github.com/j-wrigley/Super-Goods">GitHub</a></p>
    <p><a href="https://www.instagram.com/supergoods.today/">Instagram</a></p>
    <p><a href="https://www.threads.net/@supergoods.today">Threads</a></p>
    <p><a href="https://super-goods.beehiiv.com/subscribe">Newsletter</a></p>
</section>

{:else}
    <p>Loading...</p>
{/if}