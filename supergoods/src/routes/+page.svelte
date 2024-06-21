<script>
    import { onMount } from 'svelte';
    import Navbar from "../components/Navbar.svelte";
    import { fetchData } from './utils/fetchData';
    import { slide } from 'svelte/transition';
    import DOMPurify from 'dompurify';
    import '../components/MainStyles.css';

    function ensureHttps(url) {
        if (!url.startsWith('http')) {
            return 'https://' + url;
        }
        return url;
    }

    function sanitizeHtml(html) {
        return DOMPurify.sanitize(html);
    }

    let mainChannelSlug = "super-goods-t2eow_bye1u";
    let channel = { contents: [] };
    let selectedChannelData = null;
    let selectedChannelIndex = null;
    let currentPage = 1;
    let selectedItem = null;
    let mainChannelPage = 1;
    let hasMoreChannels = true;
    let hasMoreItems = true;
    let loadingChannelIndex = -1;
    let loadingItems = false;
    let loadingMoreChannels = false;
    let isListView = false;  // New state variable to manage layout mode
    let imageSize = 200;  // New state variable to manage image size

    const CHANNELS_PER_PAGE = 20;
    const ITEMS_PER_PAGE = 45;
    const INITIAL_ITEMS_PER_PAGE = 45;

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    }

    function toggleLayout() {
        isListView = !isListView;
    }

    onMount(async () => {
        await loadInitialChannels();
    });

    async function loadInitialChannels() {
        const initialData = await fetchData(mainChannelSlug, CHANNELS_PER_PAGE, mainChannelPage);
        if (initialData.contents) {
            channel.contents = initialData.contents;
            channel.title = initialData.title;
            channel.id = initialData.id;
            channel.description = initialData.metadata.description;
            hasMoreChannels = initialData.contents.length === CHANNELS_PER_PAGE;
        }
    }

    async function handleChannelClick(channelSlug, index) {
        loadingChannelIndex = index;
        try {
            const data = await fetchData(channelSlug, INITIAL_ITEMS_PER_PAGE, 1);
            if (data.contents) {
                selectedChannelData = { ...data, contents: data.contents };
                selectedChannelIndex = index;
                selectedItem = null;
                currentPage = Math.ceil(data.contents.length / ITEMS_PER_PAGE);
                hasMoreItems = data.contents.length === INITIAL_ITEMS_PER_PAGE;
            }
        } catch (error) {
            console.error('Error loading the channel:', error);
        } finally {
            loadingChannelIndex = -1;
        }
    }

    async function loadMoreChannels() {
        loadingMoreChannels = true;
        mainChannelPage += 1;
        const moreData = await fetchData(mainChannelSlug, CHANNELS_PER_PAGE, mainChannelPage);
        if (moreData.contents) {
            channel.contents = channel.contents.concat(moreData.contents);
            hasMoreChannels = moreData.contents.length === CHANNELS_PER_PAGE;
        } else {
            hasMoreChannels = false;
        }
        loadingMoreChannels = false;
    }

    async function handleItemClick(item) {
        if (selectedItem === item) {
            selectedItem = null;
        } else {
            selectedItem = item;
        }
    }

    function handleCloseClick() {
        selectedItem = null;
    }

    async function loadMore(channelSlug) {
        loadingItems = true;
        try {
            currentPage += 1;
            const moreData = await fetchData(channelSlug, ITEMS_PER_PAGE, currentPage);
            if (moreData.contents && moreData.contents.length > 0) {
                const newContents = moreData.contents.filter(item => 
                    !selectedChannelData.contents.some(existingItem => existingItem.id === item.id)
                );

                selectedChannelData.contents = selectedChannelData.contents.concat(newContents);
                hasMoreItems = moreData.contents.length === ITEMS_PER_PAGE;
            } else {
                hasMoreItems = false;
            }
        } catch (error) {
            console.error('Error loading more items:', error);
        } finally {
            loadingItems = false;
        }
    }
</script>

<style>
    .button {
        cursor: pointer;
        padding: 10px;
        margin: 5px;
        border: 1px solid var(--houseRed);
        background-color: var(--houseWhite);
        color: var(--houseRed);
    }
    .slider-container {
        display: flex;
        align-items: center;
        margin: 10px 0px 16px 0px;
    }
    #image-size-slider {
        -webkit-appearance: none;  /* Override default CSS styles */
        appearance: none;
        height: 1px; /* Specified height */
        background: var(--houseRed); /* Grey background */
        outline: none; /* Remove outline */
        opacity: 1; /* Set transparency (for mouse-over effects on hover) */
        -webkit-transition: .2s; /* 0.2 seconds transition on hover */
        transition: opacity .2s;
        cursor: pointer;
    }
    #image-size-slider::-webkit-slider-thumb {
        -webkit-appearance: none;  /* Override default CSS styles */
        appearance: none;
        width: 10px;
        height: 10px; /* Specified height */
        background: var(--houseRed); /* Grey background */
        outline: none; /* Remove outline */
        opacity: 1; /* Set transparency (for mouse-over effects on hover) */
        -webkit-transition: .2s; /* 0.2 seconds transition on hover */
        transition: opacity .2s;
        cursor: pointer;
    }
    .buttons-container {
        display: flex;
        gap: 20px;
        position: sticky;
        top: 20px;
        z-index: 998;
    }
</style>

<!-- Main Channel -->
{#if channel.contents && Array.isArray(channel.contents) && channel.contents.length > 0}

<!-- Site Description -->
<div class="juni-24">
    <p id="site-description">{channel.description}</p>
</div>

<!-- Site Navbar -->
<div class="site-navbar-home">
    <Navbar/>
</div>

<!-- Site Header -->
<section class="site-header">
    <div class="site-title">
        <p>{channel.title}</p>
    </div>
</section>
<!-- / Site Header -->

<section class="buttons-container">
    <!-- Layout Toggle Button -->
    <button class="layout-toggle-button" on:click={toggleLayout}>
        {#if isListView}
            <svg class="layout-toggle-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
            </svg>
        {:else}
            <svg class="layout-toggle-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="1"/>
                <rect x="3" y="7" width="12" height="1"/>
                <rect x="3" y="11" width="18" height="1"/>
                <rect x="3" y="15" width="12" height="1"/>
            </svg>
        {/if}
    </button>

    <!-- Image Size Slider (only for grid view) -->
    {#if !isListView}
        <div class="slider-container">
            <input type="range" id="image-size-slider" min="100" max="800" value={imageSize} on:input={(e) => imageSize = e.target.value}>
        </div>
    {/if}    
</section>


<!-- Site Content Container -->
<section class="site-content-container juni-18">
    {#each channel.contents as content, index}

    <!-- Channel Content -->
    <div class="channel-container">

        <div class="channel-list">
            <button id="channelItemList" class="channel-list-item juni-18" on:click={() => handleChannelClick(content.slug, index)}>
                {content.title ?? 'Untitled Channel'} 
                {#if loadingChannelIndex === index} <span>~ Fetching Content ☞</span> {/if}
            </button>
        </div>

        {#if selectedChannelData && selectedChannelIndex === index}
            <div class={`selected-channel-container ${isListView ? 'list-view' : 'grid-view'}`} transition:slide>
                <div class="selected-channel-header">
                    <p class="selected-channel-header-description">{selectedChannelData.metadata.description ?? 'No description available.'}</p>
                    <p class="selected-channel-header-length">Length : {selectedChannelData.length ?? 'No length available'}</p>
                    <p class="selected-channel-header-updated">Last Updated : {formatDate(selectedChannelData.updated_at)}</p>
                </div>

                <div class="selected-channel-content">
                    {#each selectedChannelData.contents as item, idx}
                        <div class="block juni-14 flex-item" style={isListView ? '' : `width: ${imageSize}px;`}>
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            {#if item.image && item.image.display && item.image.display.url}
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <div class="block-image" on:click={() => handleItemClick(item)}>
                                    <img src="{item.image.display.url}" alt="">
                                </div>
                            {/if}

                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <!-- svelte-ignore a11y-no-static-element-interactions -->
                            <div class="block-contentHTML" on:click={() => handleItemClick(item)}>
                                {#if item.content_html}
                                    <p>{@html item.content_html}</p>
                                {/if}
                            </div>

                            <div class="block-title">
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-no-static-element-interactions -->
                                <span on:click={() => handleItemClick(item)}>{@html sanitizeHtml(idx + 1 + '. ' + (item.title ?? 'Untitled Item'))}</span>
                                {#if item.source && item.source.url}
                                    <span>: <a class="clear-link" target="_blank" rel="noopener noreferrer" href="{ensureHttps(item.source.url)}">Source</a></span>
                                {/if}
                            </div>
                        </div>

                        {#if selectedItem === item}
                            <div class="selected-block-content-container juni-18" transition:slide>
                                <div class="selected-block-content">
                                    <button id="cardButton" class="close-button juni-18" on:click={handleCloseClick}>CLOSE</button>
                                
                                    {#if item.image && item.image.display && item.image.display.url}
                                        <div class="selected-block-content-image">
                                            <img src="{item.image.display.url}" alt="">
                                        </div>
                                    {/if}

                                    <div class="details-tags card-flex-container">
                                        {#if item.created_at}
                                            <p id="tag" class="card-flex-item">{formatDate(item.created_at)}</p>
                                        {/if}

                                        {#if item.class}
                                            <p id="tag" class="card-flex-item">{item.class}</p>
                                        {/if}
                                    </div>

                                    <div class="selected-block-content-details">
                                        <div class="details-header">
                                            {#if item.title} 
                                                <span id="title">{item.title ?? 'No Description'}</span>
                                            {/if}
                                            {#if item.source && item.source.url}
                                                <span id="title"> : <a class="clear-link" target="_blank" rel="noopener noreferrer" href="{ensureHttps(item.source.url)}">Source</a></span>
                                            {/if}
                                            {#if item.attachment && item.attachment.url}
                                                <span id="title"> : <a class="clear-link" target="_blank" rel="noopener noreferrer" href="{ensureHttps(item.attachment.url)}">Source</a></span>
                                            {/if}
                                        </div>

                                        <div class="details-content">
                                            {#if item.content_html}
                                                <p id="content">{@html item.content_html}</p>
                                            {/if}

                                            {#if item.description_html}
                                                <p id="description">{@html item.description_html ?? 'No Description'}</p>
                                            {/if}
                                        </div>

                                        <div class="details-tags">
                                            {#if item.source && item.source.provider && item.source.provider.name && item.source.provider.url}
                                                <p id="tag"><a class="clear-link" target="_blank" rel="noopener noreferrer" href="{ensureHttps(item.source.provider.url)}">{item.source.provider.name}</a></p>
                                            {/if}

                                            {#if item.attachment && item.attachment.file_size_display}
                                                <p id="tag">{item.attachment.file_size_display}</p>
                                            {/if}

                                            {#if item.attachment && item.attachment.extension}
                                                <p id="tag">{item.attachment.extension}</p>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    {/each}
                </div>
                {#if hasMoreItems}
                    <button id="buttonMain" class="juni-18" on:click={() => loadMore(selectedChannelData.slug)}>
                        {#if loadingItems} FETCHING MORE {/if}
                        {#if !loadingItems} LOAD MORE {/if}
                    </button>
                {/if}
            </div>
            {/if}
    </div>
    {/each}

    <div class="channel-load-more-button">
        {#if hasMoreChannels}
            <button id="buttonMain" class="juni-18" on:click={loadMoreChannels}>
                {#if loadingMoreChannels} FETCHING MORE {/if}
                {#if !loadingMoreChannels} LOAD MORE CHANNELS {/if}
            </button>
        {/if}
    </div>
</section>
{/if}
