<script lang="ts">
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

  const ARTISTS = ['100 gecs', 'Frost Children', 'Jane Remover', 'Porter Robinson', 'Sewerslvt',
    'torr', 'webcage', 'underscores', 'quannnic', 'glaive', 'ericdoa', 'brakence'];
</script>

<ScrollArea class="h-40 w-56 border">
  <div class="p-3">
    <p class="fk-label mb-2">artist</p>
    {#each ARTISTS as artist (artist)}
      <p class="py-1 text-sm">{artist}</p>
    {/each}
  </div>
</ScrollArea>
