<script lang="ts">
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { buttonVariants } from '$lib/components/ui/button/index.js';

  let shuffle = $state(true);
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}>open the menu</DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-52" align="start">
    <DropdownMenu.Group>
      <DropdownMenu.GroupHeading>album</DropdownMenu.GroupHeading>
      <DropdownMenu.Item>Play <DropdownMenu.Shortcut>⏎</DropdownMenu.Shortcut></DropdownMenu.Item>
      <DropdownMenu.Item>Send to the device</DropdownMenu.Item>
      <DropdownMenu.CheckboxItem bind:checked={shuffle}>Shuffle</DropdownMenu.CheckboxItem>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item variant="destructive">Remove from the library</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
