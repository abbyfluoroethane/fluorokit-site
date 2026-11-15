<script lang="ts">
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
</script>

<div class="flex items-center gap-4">
  <Skeleton class="size-12" />
  <div class="flex flex-col gap-2">
    <Skeleton class="h-4 w-56" />
    <Skeleton class="h-4 w-40" />
  </div>
</div>
