<script lang="ts">
  import { Switch } from '$lib/components/ui/switch/index.js';
  import { Label } from '$lib/components/ui/label/index.js';

  let on = $state(true);
</script>

<div class="flex items-center gap-3">
  <Switch id="demo-sync" bind:checked={on} />
  <Label for="demo-sync">Sync when the device connects: {on ? 'on' : 'off'}</Label>
</div>
