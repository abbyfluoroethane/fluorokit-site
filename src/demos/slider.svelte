<script lang="ts">
  import { Slider } from '$lib/components/ui/slider/index.js';

  let volume = $state(60);
</script>

<div class="flex max-w-sm items-center gap-4">
  <Slider type="single" bind:value={volume} max={100} step={1} />
  <span class="fk-data w-10 text-right">{volume}</span>
</div>
