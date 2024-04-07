<script>
    import { page } from '$app/stores';

    const title = 'Super~Goods';
    const description = 'A collection of super good links from across the Internet.';
    const imageUrl = '/Wordmark.png';
</script>

<svelte:head>
  <!-- Primary Meta Tags -->
  <title>{title}</title>
  <meta name="title" content={title} />
  <meta name="description" content={description} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://supergoods.today/" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="https://supergoods.today/favicon.png" />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" /> <!-- Use "summary" if you prefer a smaller image -->
  <meta property="twitter:url" content="https://supergoods.today/" />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content="https://supergoods.today/favicon.png" />
</svelte:head>