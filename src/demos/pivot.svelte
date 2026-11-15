<script lang="ts">
  import Pivot from 'fluorokit/svelte/Pivot.svelte';

  const PAGES = ['music', 'videos', 'pictures', 'podcasts'] as const;
  const ROWS = {
    music: ['10,000 gecs', 'Frailty', 'Worlds'],
    videos: ['launch day', 'static fire', 'teardown'],
    pictures: ['san francisco', 'tulsa', 'the workshop'],
    podcasts: ['off-nominal', 'the vergecast'],
  };
  let page = $state<(typeof PAGES)[number]>('music');
</script>

<Pivot items={PAGES} bind:value={page} />

<!-- Keyed on the page, so the rows enter again on each change. -->
{#key page}
  <ul class="mt-4 min-h-28 overflow-hidden">
    {#each ROWS[page] as row, i (row)}
      <li class="fk-enter py-1" style="--i: {i}">{row}</li>
    {/each}
  </ul>
{/key}

<!--
  As links, for a site of separate pages. Put enterDirectionScript (from
  'fluorokit/enter') in the <head> with the hrefs in nav order:

  <nav class="fk-pivot fk-pivot-sub">
    <a href="/" aria-current="page">home</a>
    <a href="/blog/">blog</a>
  </nav>
-->
