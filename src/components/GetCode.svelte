<script lang="ts">
  // The Get Code dialog: the commands for a new project, the command for a
  // project that exists, or the theme itself.
  import Pivot from 'fluorokit/svelte/Pivot.svelte';
  import { themeCss } from 'fluorokit/tools/theme-css.mjs';
  import X from 'phosphor-svelte/lib/X';
  import { Button } from '$lib/components/ui/button/index.js';

  let { open = $bindable(false), code, theme }: { open: boolean; code: string; theme: any } = $props();

  const TABS = ['new project', 'existing project', 'theme'] as const;
  let tab = $state<(typeof TABS)[number]>('new project');

  // How each package manager adds a package, runs its command, runs a
  // command that is not installed, and makes a project.
  const MANAGERS = {
    pnpm: { add: 'pnpm add', exec: 'pnpm exec', dlx: 'pnpm dlx', create: 'pnpm create' },
    npm: { add: 'npm install', exec: 'npx', dlx: 'npx', create: 'npm create' },
    yarn: { add: 'yarn add', exec: 'yarn', dlx: 'yarn dlx', create: 'yarn create' },
    bun: { add: 'bun add', exec: 'bunx', dlx: 'bunx', create: 'bun create' },
  };
  type Manager = keyof typeof MANAGERS;
  let manager = $state<Manager>('pnpm');

  const TEMPLATES = [
    { id: 'sveltekit', name: 'SvelteKit', note: 'shadcn-svelte', shadcn: true, make: (m: Manager) => `${MANAGERS[m].dlx} sv create my-app --template minimal --types ts --add tailwindcss`, css: 'src/theme.css' },
    { id: 'vite', name: 'Vite + Svelte', note: 'shadcn-svelte', shadcn: true, make: (m: Manager) => `${MANAGERS[m].create} vite@latest my-app -- --template svelte-ts`, css: 'src/theme.css' },
    { id: 'astro', name: 'Astro', note: 'plain CSS, no shadcn-svelte', shadcn: false, make: (m: Manager) => `${MANAGERS[m].create} astro@latest my-app`, css: 'src/styles/theme.css' },
  ];
  let template = $state('sveltekit');
  const t = $derived(TEMPLATES.find((x) => x.id === template)!);

  const PARTS = [
    { id: 'shadcn', name: 'For shadcn-svelte', note: 'The fluorokit variables and the ones shadcn-svelte components read.', file: 'theme.css' },
    { id: 'css', name: 'Plain CSS', note: 'The fluorokit variables only, for a project without shadcn-svelte.', file: 'theme.css' },
    { id: 'json', name: 'Theme file for the kit', note: 'A JSON file for tokens/themes/ of fluorokit. The kit then builds each form of the theme.', file: 'custom.json' },
  ];
  let part = $state('shadcn');
  const p = $derived(PARTS.find((x) => x.id === part)!);

  const m = $derived(MANAGERS[manager]);
  const themeCommand = (format: string, out: string) =>
    `${m.exec} fluorokit theme --preset ${code}${format === 'shadcn' ? '' : ` --format ${format}`} --out ${out}`;
  const newProject = $derived(
    [
      t.make(manager),
      'cd my-app',
      ...(t.shadcn ? [`${m.dlx} shadcn-svelte@latest init`] : []),
      `${m.add} ../fluorokit`,
      themeCommand(t.shadcn ? 'shadcn' : 'css', t.css),
    ].join('\n'),
  );
  const entry = $derived(
    t.shadcn
      ? `@import 'tailwindcss';\n@import 'fluorokit/structure.css';\n@import './theme.css';\n@import 'fluorokit/tailwind.css';\n@import 'fluorokit/base.css' layer(components);`
      : `@import 'fluorokit/structure.css';\n@import './theme.css';\n@import 'fluorokit/base.css';`,
  );
  const existing = $derived(themeCommand(p.id, p.file));
  const css = $derived(themeCss(theme, true));

  let dialog = $state<HTMLDialogElement>();
  $effect(() => {
    if (open && !dialog?.open) dialog?.showModal();
    if (!open && dialog?.open) dialog.close();
  });
  let note = $state('');
  async function copy(text: string, what: string) {
    try {
      await navigator.clipboard.writeText(text);
      note = `${what} copied`;
    } catch {
      note = 'The copy failed. Select the text and copy it.';
    }
    setTimeout(() => (note = ''), 1800);
  }
</script>

{#snippet managers()}
  <div class="managers" role="group" aria-label="Package manager">
    {#each Object.keys(MANAGERS) as name (name)}
      <button type="button" aria-pressed={manager === name} onclick={() => (manager = name as Manager)}>{name}</button>
    {/each}
  </div>
{/snippet}

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog class="fk-dialog code" bind:this={dialog} aria-label="Get Code" onclose={() => (open = false)} onclick={(e) => e.target === dialog && (open = false)}>
  <div class="top">
    <Pivot items={TABS} bind:value={tab} size="subpivot" />
    <Button variant="ghost" size="icon-sm" aria-label="Close" onclick={() => (open = false)}><X /></Button>
  </div>

  {#if tab === 'new project'}
    <p class="fk-label">Template</p>
    <div class="grid">
      {#each TEMPLATES as item (item.id)}
        <button class="choice" type="button" aria-pressed={template === item.id} onclick={() => (template = item.id)}>
          <span class="fk-subheading">{item.name}</span>
          <span class="fk-small fk-muted">{item.note}</span>
        </button>
      {/each}
    </div>
    <div class="block">
      {@render managers()}
      <pre>{newProject}</pre>
    </div>
    <p class="fk-small fk-muted">fluorokit is not on npm yet, so the fourth line adds it from a folder beside the project. Then put this in the CSS entry of the project:</p>
    <div class="block"><pre>{entry}</pre></div>
    <div class="buttons">
      <Button class="flex-1" onclick={() => copy(newProject, 'The commands are')}>Copy Commands</Button>
      <Button variant="outline" onclick={() => copy(entry, 'The CSS is')}>Copy CSS</Button>
    </div>
  {:else if tab === 'existing project'}
    <p class="fk-label">Apply Preset</p>
    <p class="fk-small fk-muted">Select the form of the theme to write. The project must have fluorokit.</p>
    <div class="list">
      {#each PARTS as item (item.id)}
        <button class="choice" type="button" aria-pressed={part === item.id} onclick={() => (part = item.id)}>
          <span class="fk-subheading">{item.name}</span>
          <span class="fk-small fk-muted">{item.note}</span>
        </button>
      {/each}
    </div>
    <div class="block">
      {@render managers()}
      <pre>{existing}</pre>
    </div>
    <div class="buttons">
      <Button class="flex-1" onclick={() => copy(existing, 'The command is')}>Copy Command</Button>
    </div>
  {:else}
    <p class="fk-label">Theme Tokens</p>
    <p class="fk-small fk-muted">The CSS variables of this preset, for shadcn-svelte: the fluorokit ones and the ones its components read, in each mode.</p>
    <div class="block">
      <div class="managers"><span class="file">theme.css</span></div>
      <pre class="long">{css}</pre>
    </div>
    <div class="buttons">
      <Button class="flex-1" onclick={() => copy(css, 'The theme is')}>Copy Theme</Button>
    </div>
  {/if}
  <p class="fk-small fk-muted note" aria-live="polite">{note}</p>
</dialog>

<style>
  :global(.fk-dialog.code) {
    width: min(34rem, calc(100vw - 2 * var(--fk-space-4)));
    max-height: calc(100vh - 2 * var(--fk-space-6));
    overflow-y: auto;
  }
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--fk-space-4);
    margin-bottom: var(--fk-space-6);
  }
  p {
    margin: 0 0 var(--fk-space-2);
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--fk-space-2);
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: var(--fk-space-2);
  }
  /* A choice: a box with an edge. The selected one has the text color on
     its edge. */
  .choice {
    display: flex;
    flex-direction: column;
    padding: var(--fk-space-3) var(--fk-space-4);
    border: 1px solid var(--fk-line);
    background: var(--fk-mantle);
    color: var(--fk-text);
    text-align: left;
    cursor: pointer;
  }
  .choice:hover {
    background: var(--fk-hover);
  }
  .choice[aria-pressed='true'] {
    border-color: var(--fk-text);
    background: var(--fk-raised);
  }
  .block {
    margin: var(--fk-space-4) 0;
    border: 1px solid var(--fk-line);
    background: var(--fk-mantle);
  }
  .managers {
    display: flex;
    gap: var(--fk-space-1);
    padding: var(--fk-space-2);
    border-bottom: 1px solid var(--fk-line);
  }
  .managers button,
  .file {
    padding: 2px var(--fk-space-2);
    border: 1px solid transparent;
    background: none;
    color: var(--fk-muted);
    font: 500 var(--fk-data-size) / var(--fk-data-leading) var(--fk-font-mono);
  }
  .managers button {
    cursor: pointer;
  }
  .managers button[aria-pressed='true'] {
    border-color: var(--fk-line);
    background: var(--fk-base);
    color: var(--fk-text);
  }
  pre {
    margin: 0;
    padding: var(--fk-space-3);
    font-size: var(--fk-data-size);
    line-height: var(--fk-data-leading);
    overflow-x: auto;
  }
  pre.long {
    max-height: 20rem;
    overflow: auto;
    font-size: var(--fk-label-size);
  }
  .buttons {
    display: flex;
    gap: var(--fk-space-2);
  }
  .note {
    min-height: var(--fk-small-leading);
    margin: var(--fk-space-2) 0 0;
  }
</style>
