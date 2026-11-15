<script lang="ts">
  import { Progress } from '$lib/components/ui/progress/index.js';
  import { Button } from '$lib/components/ui/button/index.js';

  let value = $state(40);
</script>

<div class="flex max-w-sm flex-col gap-4">
  <Progress {value} max={100} />
  <Button variant="outline" class="w-fit" onclick={() => (value = (value + 20) % 120)}>
    send more songs
  </Button>
</div>
