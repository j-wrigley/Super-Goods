export async function fetchData(channelSlug, itemsPerChannel, page = 1) {
    const cacheBuster = new Date().getTime(); // Generate a unique number to bypass the cache
    const url = `https://api.are.na/v2/channels/${channelSlug}?page=${page}&per=${itemsPerChannel}&sort=-created_at&_=${cacheBuster}`;
    
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('Error fetching data:', error);
        throw error;
    }
}

export async function fetchAllData(channelSlug, itemsPerChannel) {
    let page = 1;
    let allData = [];
    let hasMore = true;

    while (hasMore) {
        const response = await fetchData(channelSlug, itemsPerChannel, page);
        allData = allData.concat(response.contents);
        hasMore = response.contents.length === itemsPerChannel; // Assuming full pages indicate more data
        page++;
    }
    return allData.reverse(); // Reverse once all data is collected
}
