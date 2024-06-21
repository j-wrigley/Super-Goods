<script>
    import { onMount } from 'svelte';
    import { fetchData } from '../utils/fetchData';
    import '../../components/MainStyles.css';
    import Navbar from '../../components/Navbar.svelte';
    import { fly } from 'svelte/transition';

    let mainChannelSlug = "the-photography-index"; 
    let channel = { contents: [], title: '', description: '' }; 
    let loading = true; 
    let zIndexCounter = 1; 
    let selectedItem = null; 
    let showMobilePopup = false; 

    const ITEMS_PER_PAGE = 100; 
    const DISPLAY_ITEMS = 10; 

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    onMount(async () => {
        setViewportHeight();
        checkIfMobile();
        await loadMoodboardBlocks();
        window.addEventListener('resize', setViewportHeight);
    });

    async function loadMoodboardBlocks() {
        loading = true; 
        let allContents = [];
        let page = 1;
        let morePages = true;
        let channelData = null;

        // Fetch all pages of content
        while (morePages) {
            const data = await fetchData(mainChannelSlug, ITEMS_PER_PAGE, page);
            if (data.contents && data.contents.length > 0) {
                allContents = allContents.concat(data.contents);
                page++;
                if (!channelData) {
                    channelData = data;
                }
            } else {
                morePages = false;
            }
        }

        if (channelData) {
            channel.title = channelData.title; 
            channel.description = channelData.metadata.description; 
        }

        // Shuffle and select a random subset
        channel.contents = shuffleArray(allContents)
            .slice(0, DISPLAY_ITEMS)
            .map(item => {
                item.x = Math.random() * 80 + 'vw';
                item.y = Math.random() * 80 + 'vh';
                item.zIndex = zIndexCounter++;
                return item;
            });

        loading = false; 
    }

    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    function checkIfMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            showMobilePopup = true;
        }
    }

    let draggingElement = null;
    let offsetX, offsetY;
    let initialX, initialY;

    function handleMouseDown(event, item) {
        event.preventDefault();
        initialX = event.clientX;
        initialY = event.clientY;
        startDrag(event, item);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(event) {
        if (draggingElement) {
            moveElement(event.clientX, event.clientY);
        }
    }

    function handleMouseUp() {
        endDrag();
    }

    function handleTouchStart(event, item) {
        if (event.target.classList.contains('icon-overlay')) return; // Ignore if clicking on the icon
        event.preventDefault(); 
        initialX = event.touches[0].clientX;
        initialY = event.touches[0].clientY;
        startDrag(event.touches[0], item);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
    }

    function handleTouchMove(event) {
        if (draggingElement) {
            moveElement(event.touches[0].clientX, event.touches[0].clientY);
        }
    }

    function handleTouchEnd() {
        endDrag();
    }

    function startDrag(event, item) {
        draggingElement = item;
        const element = document.querySelector(`#item-${item.id}`);
        const rect = element.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        item.zIndex = zIndexCounter++; 
    }

    function moveElement(clientX, clientY) {
        const container = document.querySelector('.moodboard-container');
        const containerRect = container.getBoundingClientRect();

        let newX = clientX - offsetX;
        let newY = clientY - offsetY;

        newX = Math.max(0, Math.min(newX, containerRect.width - 150)); 
        newY = Math.max(0, Math.min(newY, containerRect.height - 150)); 

        draggingElement.x = newX + 'px';
        draggingElement.y = newY + 'px';
        updatePosition(draggingElement);
    }

    function endDrag() {
        draggingElement = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    }

    function updatePosition(item) {
        const element = document.querySelector(`#item-${item.id}`);
        if (element) {
            element.style.left = item.x;
            element.style.top = item.y;
            element.style.zIndex = item.zIndex;
        }
    }

    function showDetails(item) {
        selectedItem = item;
    }

    function closeCard(event) {
        event.stopPropagation(); 
        selectedItem = null;
    }

    function closeMobilePopup(event) {
        event.stopPropagation(); 
        showMobilePopup = false;
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    }
</script>

<style>
    body, html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .moodboard-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: calc(var(--vh, 1vh) * 100); 
        overflow: hidden;
        background: var(--houseWhite); 
    }

    .moodboard-item {
        position: absolute;
        width: 150px;
        height: auto;
        cursor: grab;
        user-select: none; 
    }

    .moodboard-item:active {
        cursor: grabbing;
    }

    .moodboard-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .icon-overlay {
        position: absolute;
        top: 5px;
        right: 5px;
        background: var(--houseRed);
        border-radius: 0px;
        width: 16px;
        height: 16px;
        display: none; /* Hide by default */
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .icon-overlay i {
        position: relative;
        top: 1px;
        line-height: 0;
        color: var(--houseWhite);
    }

    .moodboard-item:hover .icon-overlay {
        display: flex; /* Show on hover */
    }

    .loading-moodboard {
        position: fixed;
        top: 45%;
        bottom: 0%;
        left: 0%;
        right: 0%;
        text-align: center;
        z-index: 999;
    }

    .hover-card {
        position: fixed;
        bottom: 8px;
        right: 8px;
        width: 300px;
        max-height: 360px;
        overflow: scroll;
        border: 0.5px solid;
        background: var(--houseWhite); 
        padding: 0px 18px 18px 18px;
        transition: opacity 0.3s ease;
        opacity: 0;
        pointer-events: none;
    }

    .hover-card.active {
        opacity: 1;
        pointer-events: auto;
    }

    .hover-card .details-header {
        font-size: 16px;
        margin-bottom: 10px;
    }

    .hover-card .details-content {
        font-size: 14px;
    }

    .hover-card .close-button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        color: var(--houseRed);
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .mobile-popup {
        position: fixed;
        top: 25%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        border: 0.5px solid;
        max-width: 300px;
        background: var(--houseWhite); 
        padding: 8px 20px 20px 20px;
        transition: opacity 0.3s ease;
        opacity: 0;
        pointer-events: none;
        text-align: left;
    }

    .cardButtonInfo {
        padding: 8px;
    }

    .mobile-popup.active {
        opacity: 1;
        pointer-events: auto;
    }

    .mobile-popup .close-button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        color: var(--houseRed);
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .channel-info {
        position: fixed;
        bottom: 18px;
        left: 20px;
    }

    .channel-info p {
        padding-right: 20px;
    }

    .channel-info h2 {
        text-transform: uppercase;
        padding-bottom: 4px;
    }
</style>


{#if loading}
    <p class="loading-moodboard juni-18">LOADING MOODBOARD ☞</p>
{:else}
    <section class="moodboard-container">
        
        <div class="site-navbar-mood">
            <Navbar/>
        </div>  

        {#if channel.contents.length > 0}
            <div class="channel-info juni-14">
                <h2>This Month's Theme : {channel.title}</h2>
                <p>{channel.description}</p>
            </div>
        {/if}

        <!-- svelte-ignore a11y-no-static-element-interactions -->
        {#each channel.contents as item, index}
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
                class="moodboard-item"
                id="item-{item.id}"
                style="top: {item.y}; left: {item.x}; z-index: {item.zIndex};"
                on:mousedown={(event) => handleMouseDown(event, item)}
                on:touchstart={(event) => handleTouchStart(event, item)}
            >
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                {#if item.image && item.image.display && item.image.display.url}
                    <img src="{item.image.display.url}" alt="">
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class="juni-14 icon-overlay" on:click={() => showDetails(item)}>
                        <i>i</i>
                    </div>
                {/if}
            </div>
        {/each}
    </section>
{/if}

{#if selectedItem}
    <div class="hover-card active" transition:fly={{ y: 20, duration: 200 }}>
        <button id="cardButton" class="close-button juni-18" on:click={closeCard}>CLOSE</button>
        <div class="details-header">
            {#if selectedItem.title}
                <span id="title">{selectedItem.title ?? 'No Description'}</span>
            {/if}
            {#if selectedItem.source && selectedItem.source.url}
                <span id="title"> : <a class="clear-link" target="_blank" rel="noopener noreferrer" href="{selectedItem.source.url}">Source</a></span>
            {/if}
        </div>
        <div class="details-content">
            {#if selectedItem.content_html}
                <p class="juni-16" id="content">{@html selectedItem.content_html}</p>
            {/if}
            {#if selectedItem.description_html}
                <p class="juni-16" id="description">{@html selectedItem.description_html ?? 'No Description'}</p>
            {/if}
        </div>
        <div class="details-tags card-flex-container">
            {#if selectedItem.created_at}
                <p id="tag" class="card-flex-item">{formatDate(selectedItem.created_at)}</p>
            {/if}
            {#if selectedItem.class}
                <p id="tag" class="card-flex-item">{selectedItem.class}</p>
            {/if}

            {#if selectedItem.attachment && selectedItem.attachment.file_size_display}
                <p id="tag">{selectedItem.attachment.file_size_display}</p>
            {/if}
            {#if selectedItem.attachment && selectedItem.attachment.extension}
                <p id="tag">{selectedItem.attachment.extension}</p>
            {/if}
        </div>
    </div>
{/if}

{#if showMobilePopup}
    <div class="mobile-popup active" transition:fly={{ y: -20, duration: 200 }}>
        <button id="cardButton" class="close-button juni-18" on:click={closeMobilePopup}>CLOSE</button>
        <p class="cardButtonInfo juni-14">This page is optimised for desktop use. You can drag the images to organise your daily board, click on an image for more information and its source, or refresh the page to see a new daily board based on this month’s theme.</p>
    </div>
{/if}
