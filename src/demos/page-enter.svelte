<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';

  // 1 comes from the right, -1 from the left. The key starts the animation again.
  let dir = $state(1);
  let run = $state(0);
  const play = (side: number) => {
    dir = side;
    run += 1;
  };
</script>

{#key run}
  <div class="overflow-hidden" style="--fk-enter-dir: {dir}">
    <p class="fk-enter fk-subheading" style="--i: 0">first</p>
    <p class="fk-enter fk-subheading" style="--i: 1">second</p>
    <p class="fk-enter fk-subheading" style="--i: 2">third</p>
  </div>
{/key}

<div class="mt-6 flex gap-2">
  <Button variant="outline" onclick={() => play(-1)}>from the left</Button>
  <Button variant="outline" onclick={() => play(1)}>from the right</Button>
</div>
