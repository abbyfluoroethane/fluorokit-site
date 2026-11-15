<script lang="ts">
  import * as ContextMenu from '$lib/components/ui/context-menu/index.js';
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger class="flex h-32 max-w-sm items-center justify-center border border-dashed text-sm">
    right-click here
  </ContextMenu.Trigger>
  <ContextMenu.Content class="w-52">
    <ContextMenu.Item>Play</ContextMenu.Item>
    <ContextMenu.Item>Play next</ContextMenu.Item>
    <ContextMenu.Separator />
    <ContextMenu.Item>Show in the folder</ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
