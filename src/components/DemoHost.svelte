<script lang="ts">
  // Renders one demo from src/demos by its name. Astro hydrates this one
  // component, so a page can select the demo with a prop.
  import type { Component } from 'svelte';

  const demos = import.meta.glob<Component>('../demos/*.svelte', { eager: true, import: 'default' });
  let { name }: { name: string } = $props();
  const Demo = $derived(demos[`../demos/${name}.svelte`]);
</script>

<Demo />
