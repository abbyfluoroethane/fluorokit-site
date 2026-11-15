<script lang="ts">
  // Preview 01: the cards of an app. A music library with a device, as in
  // squirt: stock shadcn-svelte components with the kit's type and tiles.
  import Pivot from 'fluorokit/svelte/Pivot.svelte';
  import Plus from 'phosphor-svelte/lib/Plus';
  import X from 'phosphor-svelte/lib/X';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Progress } from '$lib/components/ui/progress/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import { Slider } from '$lib/components/ui/slider/index.js';
  import { Switch } from '$lib/components/ui/switch/index.js';

  const PLAYS = [['Dec', 52], ['Jan', 74], ['Feb', 60], ['Mar', 88], ['Apr', 50], ['May', 96]] as const;
  const RECENT = [
    ['10,000 gecs', '100 gecs', 'now', 'red'],
    ['Frailty', 'Jane Remover', '2 h', 'lavender'],
    ['Worlds', 'Porter Robinson', 'yesterday', 'sky'],
    ['Draining Love Story', 'Sewerslvt', 'Nov 12', 'mauve'],
    ['SPEED RUN', 'Frost Children', 'Nov 11', 'green'],
  ];
  const PAGES = ['collection', 'device', 'social'] as const;
  const ROWS = {
    collection: ['music', 'videos', 'pictures', 'podcasts'],
    device: ["abby's zune hd", '12.6 gb free of 15.5 gb'],
    social: ['last.fm', 'discord rich presence'],
  };
  let page = $state<(typeof PAGES)[number]>('collection');
  let keep = $state(40);
  let auto = $state(true);
  let scrobble = $state(false);
</script>

<section class="card">
  <div class="head">
    <p class="fk-subheading">Listening history</p>
    <p class="sub">Plays in the last six months</p>
  </div>
  <div class="chart" role="img" aria-label="Plays for each month, December to May">
    {#each PLAYS as [month, plays] (month)}
      <div class="bar"><span style="height: {plays}%"></span><span class="fk-label month">{month}</span></div>
    {/each}
  </div>
  <div class="mt-4 grid grid-cols-2 gap-2">
    <div class="box">
      <p class="fk-overline sub">most played</p>
      <p class="fk-subheading">100 gecs</p>
      <p class="sub">412 plays</p>
    </div>
    <div class="box">
      <p class="fk-overline sub">scrobbles</p>
      <p class="fk-subheading">8,204</p>
      <p class="sub">since march</p>
    </div>
  </div>
  <Button class="mt-4 w-full">view the full report</Button>
</section>

<section class="card">
  <div class="head flex items-start justify-between gap-4">
    <div>
      <p class="fk-subheading">Sync settings</p>
      <p class="sub">What squirt sends when the device connects.</p>
    </div>
    <Button variant="outline" size="icon-sm" aria-label="Close"><X /></Button>
  </div>
  <div class="flex flex-col gap-2">
    <Label for="p-device">Device name</Label>
    <Input id="p-device" value="abby's zune hd" />
  </div>
  <div class="mt-5 flex items-baseline justify-between">
    <Label>Space to keep free</Label>
    <span class="fk-heading">{keep}%</span>
  </div>
  <Slider type="single" bind:value={keep} max={100} step={5} class="mt-2" />
  <div class="mt-1 flex justify-between">
    <span class="fk-label sub">0%</span><span class="fk-label sub">100%</span>
  </div>
  <div class="mt-5 flex items-center justify-between gap-4">
    <Label for="p-auto">Sync when the device connects</Label>
    <Switch id="p-auto" bind:checked={auto} />
  </div>
  <div class="mt-3 flex items-center justify-between gap-4">
    <Label for="p-scrobble">Scrobble plays from the device</Label>
    <Switch id="p-scrobble" bind:checked={scrobble} />
  </div>
  <div class="foot">
    <Button class="w-full">save the settings</Button>
  </div>
</section>

<section class="card">
  <div class="head flex items-start justify-between gap-4">
    <div>
      <p class="fk-subheading">Storage</p>
      <p class="sub">abby's zune hd · 15.5 gb</p>
    </div>
    <span class="fk-status ok">Connected</span>
  </div>
  <div class="box">
    <p class="fk-overline sub">music</p>
    <p class="num">2.1 gb</p>
    <Progress value={72} max={100} class="mt-3" />
    <div class="mt-2 flex justify-between"><span class="sub">72% of the library sent</span><span class="fk-data">418 songs</span></div>
  </div>
  <div class="box mt-2">
    <p class="fk-overline sub">videos</p>
    <p class="num">0.8 gb</p>
    <Progress value={24} max={100} class="mt-3" />
    <div class="mt-2 flex justify-between"><span class="sub">24% of the library sent</span><span class="fk-data">6 videos</span></div>
  </div>
  <div class="foot"><p class="sub">12.6 gb is free. The pictures folder is not set.</p></div>
</section>

<section class="card text-center">
  <div class="mx-auto mb-4 flex size-9 items-center justify-center" style="background: var(--fk-raised)"><Plus /></div>
  <p class="fk-subheading">Add a folder</p>
  <p class="sub mx-auto mt-1 mb-4 max-w-64">Select the folder that holds your music. squirt reads it, and does not move the files.</p>
  <Button variant="secondary">select a folder</Button>
</section>

<section class="card">
  <p class="fk-overline sub">my application</p>
  <p class="fk-title">start</p>
  <div class="mt-3"><Pivot items={PAGES} bind:value={page} size="subpivot" /></div>
  {#key page}
    <ul class="rows">
      {#each ROWS[page] as row, i (row)}
        <li class="fk-enter" style="--i: {i}">{row}</li>
      {/each}
    </ul>
  {/key}
</section>

<section class="card">
  <div class="head">
    <p class="fk-subheading">Recently played</p>
    <p class="sub">On this computer and on the device</p>
  </div>
  {#each RECENT as [title, artist, when, color], i (title)}
    {#if i > 0}<Separator />{/if}
    <div class="flex items-center gap-3 py-2.5">
      <span class="size-9 shrink-0" style="background: var(--fk-tile-{color}, var(--fk-accent))"></span>
      <div class="min-w-0 flex-1">
        <p class="truncate font-semibold">{title}</p>
        <p class="sub truncate">{artist}</p>
      </div>
      <span class="fk-data sub">{when}</span>
    </div>
  {/each}
</section>

<section class="card flush">
  <div class="fk-tile-grid tiles">
    <div class="fk-tile" data-size="wide" style="--fk-tile-color: var(--fk-tile-pink)"><span class="fk-overline">music</span></div>
    <div class="fk-tile" style="--fk-tile-color: var(--fk-tile-sky)"><span class="fk-overline">videos</span></div>
    <div class="fk-tile" style="--fk-tile-color: var(--fk-tile-lavender)"><span class="fk-overline">pictures</span></div>
    <div class="fk-tile" data-size="wide" style="--fk-tile-color: var(--fk-tile-blue)"><span class="fk-overline">podcasts</span></div>
    <div class="fk-tile" style="--fk-tile-color: var(--fk-tile-green)"><span class="fk-overline">social</span></div>
    <div class="fk-tile" style="--fk-tile-color: var(--fk-tile-red)"><span class="fk-overline">settings</span></div>
  </div>
</section>

<section class="card">
  <div class="head">
    <p class="fk-subheading">Device</p>
    <p class="sub">Menus and dialogs take the theme too.</p>
  </div>
  <div class="flex flex-wrap gap-2">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class={buttonVariants({ variant: 'outline' })}>actions</DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-52" align="start">
        <DropdownMenu.Item>Sync now</DropdownMenu.Item>
        <DropdownMenu.Item>Rename the device</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item variant="destructive">Erase the device</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
    <AlertDialog.Root>
      <AlertDialog.Trigger class={buttonVariants({ variant: 'destructive' })}>remove the device</AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Remove this device?</AlertDialog.Title>
          <AlertDialog.Description>The songs stay on the device. It will not sync again until you set it up.</AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action>Remove</AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </div>
  <div class="fk-bar mt-5" style="height: var(--fk-bar-edge)"></div>
</section>

<style>
  .chart {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: var(--fk-space-3);
    height: 11rem;
  }
  .bar {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: stretch;
    gap: var(--fk-space-1);
  }
  .bar span:first-child {
    background: var(--fk-accent);
  }
  .month {
    text-align: center;
    color: var(--fk-muted);
  }
  .rows {
    min-height: 7.5rem;
    margin: var(--fk-space-3) 0 0;
    padding: 0;
    list-style: none;
    overflow: hidden;
  }
  .rows li {
    padding: var(--fk-space-1) 0;
  }
  /* Four half-size tiles across, whatever the width of the card. */
  .tiles {
    --fk-tile-1: auto;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 6rem;
    padding: var(--fk-tile-gap);
  }
</style>
