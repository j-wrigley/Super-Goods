<Meta/>
<script>    
    import Navbar from "../components/Navbar.svelte";
    import Meta from "../components/Meta.svelte";

    import { onMount } from 'svelte';
    let allData = [];
    let data = { contents: [] };
    let currentPage = 1;
    let itemsPer = 10;
    let channel = "super-goods-lhev24-ol-y"; // EDIT HERE (Add Are.na Channel Slug)
    let isLoading = false;
    let totalLength; 

    function updateDisplayedData() {
        const startIndex = (currentPage - 1) * itemsPer;
        const endIndex = startIndex + itemsPer;
        const newContents = allData.slice(startIndex, endIndex);
        if (newContents.length > 0) {
            data.contents = [...data.contents, ...newContents];
            data = { ...data };
        }
    }

    async function fetchAllData() {
        if (isLoading) return;
        isLoading = true;

        let initialResponse = await fetch(`https://api.are.na/v2/channels/${channel}?page=1&per=${itemsPer}&_=${new Date().getTime()}`);
        if (initialResponse.ok) {
            let initialData = await initialResponse.json();
            totalLength = initialData.length;
            const totalPages = Math.ceil(totalLength / itemsPer);
            
            data.title = initialData.title;
            data.metadata = initialData.metadata;
            data.created_at = initialData.created_at;
            data.length = initialData.length;

            const pageRequests = [];
            for (let page = 1; page <= totalPages; page++) {
                const apiUrl = `https://api.are.na/v2/channels/${channel}?page=${page}&per=${itemsPer}&_=${new Date().getTime()}`;
                pageRequests.push(fetch(apiUrl).then(res => res.json()));
            }
            try {
                const pagesData = await Promise.all(pageRequests);
                allData = pagesData.flatMap(pageData => pageData.contents || [])
                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                updateDisplayedData();
            } catch (error) {
                console.error("Failed to load all channel data:", error);
            }
        } else {
            console.error("Failed to fetch initial data.");
        }
        isLoading = false;
    }
 
    function handleScroll() {
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        const totalPages = Math.ceil(allData.length / itemsPer);

        if (scrollTop + window.innerHeight + 100 >= scrollHeight && !isLoading && currentPage < totalPages) {
            currentPage++;
            updateDisplayedData();
        }
    }

    onMount(() => {
        window.addEventListener("scroll", handleScroll);
        fetchAllData();
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

    let isPageLoading = true;
    setTimeout(() => {
        isPageLoading = false;
    }, 2000);
</script>

<style>
    .loadingDiv {
        font-family: 'Junicode';
        font-size: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 1); /* Semi-transparent white background */
        z-index: 100; /* Ensure it's above other content */
    }
    @keyframes spin {
        from {
        transform: rotate(0deg);
        }
        to {
        transform: rotate(360deg);
        }
    }
    .loadingSymbol {
        animation: spin 2s ease-in-out infinite;
    }
    .superGoodsContainer {
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
    }
    .superGoodsBlock {
        display: flex;
        flex: 1 1 23.3333%; /* grow, shrink, basis */
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        position: relative;
        width: 300px;
        height: 300px;
        padding: 20px;
        border: 0.5px solid;
        opacity: 1;
        transition: 0.2s all;
    }
    .Text {
        width: 400px;
    }
    .Channel {
        display: none;
    }
    .sg-provider {
        padding-bottom: 8px;
    }
    .sg-title {
        white-space: pre-wrap; /* Allows the text to wrap to the next line as needed */
        word-break: break-all; /* Allows unbreakable words to be broken */
        overflow-wrap: break-word; /* Break words that are too long for the container */
        /* hyphens: auto; Attempt to hyphenate at appropriate hyphenation points */
        padding-bottom: 12px;
    }
    .sg-description {
        white-space: pre-wrap;
        overflow-wrap: break-word;
        hyphens: auto;
        max-height: 120px;
        padding-bottom: 8px !important;
        overflow-y: auto;
        overflow-x: hidden;        
        padding-bottom: 24px;
        padding-right: 8px;
    }
    .sg-content {
        height: 140px;
        padding-bottom: 0px !important;
        overflow-y: auto;
        overflow-x: hidden;       
        padding-right: 8px; 
    }
    .sg-infoContainer {
        width: 100%;
    }
    .superGoodsBlock .sg-details {
        display: none;
        opacity: 0;
        display: flex;
        position: absolute;
        left: 0%;
        padding: 8px;
        text-wrap: nowrap;
        width: 170px;
        height: auto;
        border: 0.5px solid;
        background: #FF0000;
        border-color: #FF0000;
        text-align: left;
        color: #fff;
        flex-direction: column;
        z-index: 9;
    }
    .superGoodsBlock:hover .sg-details {
        opacity: 1;
        position: fixed;
        left: auto;
        right: 0%;
        top: 0px;
    }
    .superGoodsBlock:hover {
        position: relative;
        background-color: #FCFCFC;
        transition: 0.2s all;
    }
    .sg-details p {
        opacity: 1;
        width: 100%;
    }
    .sg-image {
        padding-bottom: 8px;
        mix-blend-mode: screen;
    }
    .sg-button {
        width: 100px;
        text-align: center;
        margin-top: 8px;
        padding-top: 8px;
        padding-bottom: 8px;
        border: 1px dashed;
        transition: 0.2s all;
    }
    .sg-button:hover {
        background-color: #FF0000;
        color: #fff;
        transition: 0.2s all;
    }
    @media (min-width: 2020px) {
        .superGoodsBlock {
            flex: 1 1 13.3333%;
        }
    }
    @media (max-width: 768px) {
        .superGoodsBlock {
            flex: 1 1 100%;
        }
        .superGoodsBlock .sg-details {
            display: none;
        }
    }
</style>

<!-- Loading Splash Page -->
{#if isLoading}
    <div class="loadingDiv">
        <div class="loadingSymbol siteTitle">☞</div> <!-- EDIT HERE -->
    </div>
{/if}

<!-- Are.na Channel Data -->
{#if data}

    <!-- Channel Title -->
    <div class="siteTitle">
        {#if data.title}
            <p>{data.title}</p>
        {/if}
    </div>

    <!-- Channel Description & Information -->
    <div class="siteDescription sm-text-n">
        {#if data}
        <div class="siteDescription-left">
            {#if data.metadata && data.metadata.description}
                <p>{data.metadata.description}</p>
            {/if}
        </div>
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

    <!-- Navbar Component -->
    <Navbar/>

    <!-- Channel Contents Container -->
    <section class="superGoodsContainer">
        {#each data.contents as content}

            <!-- Channel Content Block -->
            <div class="superGoodsBlock {content.base_class} {content.class} {content.id}">

                <!-- Channel Source Provider & Content Title -->
                <div>
                    {#if content.source && content.source.provider && content.source.provider.name && content.source.provider.url}
                        <p class="sg-provider xs-text-n"><a target="_blank" rel="noopener noreferrer" href="{formatUrl(content.source.provider.url)}">{content.source.provider.name}</a></p>
                    {/if}
                    {#if content.generated_title}
                        <p class="sg-title lg-text-n">{content.generated_title}</p>
                    {/if}
                </div>

                <!-- Channel Content Block Conent & Source -->
                <div class="sg-infoContainer">
                    {#if content.content}
                        <p class="sg-content sm-text-n scrollable-content">{content.content}</p>
                    {/if}
                    <div>
                        {#if content.description_html}
                            <div class="sg-description sm-text-n">
                                {@html content.description_html}
                            </div>
                        {/if}
                        {#if content.source && content.source.url}
                            <p class="sg-soruce sg-button base-text-n"><a href="{content.source.url}">Source</a></p>
                        {/if}
                        {#if content.embed && content.embed.url}
                            <p class="sg-embed sg-button base-text-n"><a href="{content.embed.url}">Embed</a></p>
                        {/if}
                        {#if content.attachment && content.attachment.url}
                            <p class="sg-download sg-button base-text-n"><a href="{content.attachment.url}">Download</a></p>
                        {/if}
                    </div>
                </div>

                <!-- Channel Content Image & Details -->
                <div class="sg-details">
                    {#if content.image && content.image.square && content.image.display.url}
                        <img class="sg-image" src="{content.image.display.url}" alt="">
                    {/if}
                    {#if content.class}
                        <p class="xs-text-n">{content.class}</p>
                    {/if}
                    {#if content.attachment && content.attachment.file_size_display}
                        <p class="xs-text-n">{content.attachment.file_size_display}</p>
                    {/if}
                </div>

            </div>
        {/each}
    </section>

{:else}
    <p>Loading...</p>
{/if}