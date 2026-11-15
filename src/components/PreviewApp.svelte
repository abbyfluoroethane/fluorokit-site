<script lang="ts">
  // Shows a preview in the theme that the parent page sends. Until a theme
  // comes (or with no parent), it shows the ink theme.
  import { onMount } from 'svelte';
  import One from './previews/One.svelte';
  import Two from './previews/Two.svelte';

  let view = $state('01');
  let label = $state({ base: 'Ink', font: 'IBM Plex Sans', code: 'f009000' });

  onMount(() => {
    const style = document.createElement('style');
    document.head.append(style);
    const root = document.documentElement;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.data?.type !== 'fk-theme') return;
      const d = event.data;
      style.textContent = d.css;
      root.dataset.fkTheme = d.name;
      root.classList.remove('dark', 'light');
      if (d.mode === 'dark' || d.mode === 'light') root.classList.add(d.mode);
      view = d.view;
      label = d.label;
    };
    addEventListener('message', onMessage);
    parent.postMessage({ type: 'fk-ready' }, location.origin);
    return () => removeEventListener('message', onMessage);
  });
</script>

<div class="wall">
  {#if view === '02'}
    <Two {label} />
  {:else}
    <One />
  {/if}
</div>

<style>
  /* A wall of cards, in columns. A card does not break between columns. */
  .wall {
    min-height: 100vh;
    padding: var(--fk-space-8);
    columns: 3 20rem;
    column-gap: var(--fk-space-6);
  }
  .wall :global(.card) {
    break-inside: avoid;
    margin: 0 0 var(--fk-space-6);
    padding: var(--fk-space-6);
    border: 1px solid var(--fk-line);
    background: var(--fk-mantle);
  }
  .wall :global(.card.flush) {
    padding: 0;
  }
  .wall :global(.card p) {
    margin: 0;
    max-width: none;
  }
  .wall :global(.card .head) {
    margin-bottom: var(--fk-space-4);
  }
  .wall :global(.card .sub) {
    color: var(--fk-muted);
    font-size: var(--fk-small-size);
    line-height: var(--fk-small-leading);
  }
  .wall :global(.card .foot) {
    margin: var(--fk-space-6) calc(-1 * var(--fk-space-6)) calc(-1 * var(--fk-space-6));
    padding: var(--fk-space-4) var(--fk-space-6);
    border-top: 1px solid var(--fk-line);
    background: var(--fk-base);
  }
  .wall :global(.card .num) {
    font-size: var(--fk-title-size);
    font-weight: 300;
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .wall :global(.card .box) {
    padding: var(--fk-space-3) var(--fk-space-4);
    background: var(--fk-base);
  }
  @media (max-width: 700px) {
    .wall {
      padding: var(--fk-space-4);
    }
  }
</style>
