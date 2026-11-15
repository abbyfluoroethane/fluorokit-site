<script lang="ts">
  // Preview 02: the parts of the theme. Its colors with their names, the
  // type scale, the controls, the tile colors and the code colors.
  import Pivot from 'fluorokit/svelte/Pivot.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Slider } from '$lib/components/ui/slider/index.js';
  import { Switch } from '$lib/components/ui/switch/index.js';

  let { label }: { label: { base: string; font: string; code: string } } = $props();

  const SURFACES = ['base', 'mantle', 'deep', 'raised', 'line', 'overlay'];
  const INKS = ['text', 'muted', 'accent', 'bar-start', 'focus', 'control-border'];
  const SIGNALS = ['status-ok', 'status-warn', 'status-error', 'status-info', 'chart-1', 'chart-2'];
  const TILES = ['rosewater', 'flamingo', 'pink', 'mauve', 'red', 'maroon', 'peach', 'yellow', 'green', 'teal', 'sky', 'sapphire', 'blue', 'lavender'];
  const SIZES = ['pivot', 'subpivot'] as const;
  let size = $state<(typeof SIZES)[number]>('pivot');
  let level = $state(50);
  let on = $state(true);
</script>

{#snippet swatches(names: string[])}
  <div class="swatches">
    {#each names as name (name)}
      <div>
        <span style="background: var(--fk-{name})"></span>
        <p class="fk-label name">{name}</p>
      </div>
    {/each}
  </div>
{/snippet}

<section class="card">
  <div class="head">
    <p class="fk-overline sub">--preset {label.code}</p>
    <p class="fk-title">{label.base.toLowerCase()}</p>
    <p class="sub">{label.font} · the colors of the theme, by their token names.</p>
  </div>
  {@render swatches(SURFACES)}
  {@render swatches(INKS)}
  {@render swatches(SIGNALS)}
</section>

<section class="card">
  <p class="fk-overline sub">overline</p>
  <p class="fk-hero">hero</p>
  <p class="fk-title">title</p>
  <p class="fk-heading mt-2">Heading</p>
  <p class="fk-subheading">Subheading</p>
  <p class="mt-2">Body text. A strong body style keeps long text easy to read, with <a href="#type">a link</a> and <span class="fk-muted">muted text</span> beside it.</p>
  <p class="fk-small mt-2">Small text for captions.</p>
  <p class="fk-data mt-2">2026-11-15 · 152px · {label.code}</p>
</section>

<section class="card">
  <div class="flex flex-wrap gap-2">
    <Button>Button</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="destructive">Destructive</Button>
  </div>
  <div class="box mt-4 flex items-center justify-between gap-4">
    <span class="fk-label">Two-step sign-in</span>
    <Button variant="secondary" size="sm">enable</Button>
  </div>
  <Slider type="single" bind:value={level} max={100} class="mt-5" />
  <Input class="mt-5" placeholder="Name" />
  <div class="mt-5 flex flex-wrap items-center justify-between gap-4">
    <div class="flex flex-wrap gap-4">
      <span class="fk-status ok">ok</span>
      <span class="fk-status warn">warn</span>
      <span class="fk-status error">error</span>
      <span class="fk-status info">info</span>
    </div>
    <Switch bind:checked={on} aria-label="Example switch" />
  </div>
</section>

<section class="card">
  <div class="head">
    <p class="fk-subheading">Tile colors</p>
    <p class="sub">White text on each fill, at the contrast of the preset.</p>
  </div>
  <div class="tile-ring">
    {#each TILES as name (name)}
      <div class="fk-tile" style="--fk-tile-color: var(--fk-tile-{name})"><span class="fk-overline">{name}</span></div>
    {/each}
  </div>
</section>

<section class="card">
  <p class="fk-overline sub">pivot</p>
  <div class="mt-2"><Pivot items={SIZES} bind:value={size} size={size} /></div>
  {#key size}
    <p class="fk-enter mt-3 sub">A click gives the page-enter its side. This text came from the {size === 'pivot' ? 'left' : 'right'}.</p>
  {/key}
  <div class="fk-bar mt-5" style="height: var(--fk-bar-field)"></div>
</section>

<section class="card flush">
  <pre class="code"><span class="c">// code, in the theme's syntax colors</span>
<span class="k">import</span> {'{'} setEnterDirection {'}'} <span class="k">from</span> <span class="s">'fluorokit/enter'</span>;

<span class="k">const</span> <span class="n">PAGES</span> = [<span class="s">'music'</span>, <span class="s">'videos'</span>];
<span class="k">let</span> count = <span class="d">2</span>;

<span class="k">function</span> <span class="f">goTo</span>(page) {'{'}
  <span class="f">setEnterDirection</span>(<span class="n">PAGES</span>, current, page);
  current = page;
{'}'}</pre>
</section>

<style>
  .swatches {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: var(--fk-space-2);
    margin-top: var(--fk-space-3);
  }
  .swatches span {
    display: block;
    aspect-ratio: 1;
    border: 1px solid var(--fk-line);
  }
  .name {
    margin-top: var(--fk-space-1);
    font-family: var(--fk-font-mono);
    font-weight: 400;
    color: var(--fk-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tile-ring {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
    gap: var(--fk-tile-gap);
  }
  .tile-ring .fk-tile {
    aspect-ratio: 1;
  }
  .code {
    margin: 0;
    padding: var(--fk-space-6);
    color: var(--fk-text);
    line-height: var(--fk-data-leading);
    overflow-x: auto;
  }
  .code .c { color: var(--fk-syntax-comment, var(--fk-muted)); font-style: italic; }
  .code .k { color: var(--fk-syntax-keyword, var(--fk-accent)); }
  .code .s { color: var(--fk-syntax-string, var(--fk-status-ok)); }
  .code .n { color: var(--fk-syntax-constant, var(--fk-chart-2)); }
  .code .d { color: var(--fk-syntax-number, var(--fk-status-warn)); }
  .code .f { color: var(--fk-syntax-function, var(--fk-status-info)); }
</style>
