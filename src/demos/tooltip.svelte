<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import { buttonVariants } from '$lib/components/ui/button/index.js';
</script>

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger class={buttonVariants({ variant: 'outline' })}>hover me</Tooltip.Trigger>
    <Tooltip.Content>
      <p>Send to the device</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
