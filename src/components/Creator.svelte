<script lang="ts">
  // The create page: named choices in a rail, a live preview in an iframe.
  // The choices make a preset code, which is in the URL (?preset=...). The
  // theme of the choices goes to the preview with postMessage.
  import { onMount } from 'svelte';
  import { DEFAULT, KEYS, OPTIONS, decodePreset, encodePreset, themeOf } from 'fluorokit/tools/presets.mjs';
  import { themeCss } from 'fluorokit/tools/theme-css.mjs';
  import { hex } from 'fluorokit/tools/color.mjs';
  import List from 'phosphor-svelte/lib/List';
  import Lock from 'phosphor-svelte/lib/Lock';
  import LockOpen from 'phosphor-svelte/lib/LockOpen';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import GetCode from './GetCode.svelte';

  type Key = (typeof KEYS)[number];
  type Choice = Record<Key, string>;
  const LABELS: Record<Key, string> = { base: 'Base', accent: 'Accent', second: 'Second Color', text: 'Text', tiles: 'Tiles', font: 'Font' };
  // The rail shows the choices in groups, with a rule between them.
  const GROUPS: Key[][] = [['base'], ['accent', 'second'], ['text', 'tiles'], ['font']];

  let choice = $state<Choice>({ ...DEFAULT });
  let locks = $state<Record<string, boolean>>({});
  let past = $state<Choice[]>([]);
  let future = $state<Choice[]>([]);
  let view = $state<'01' | '02'>('01');
  let mode = $state<'auto' | 'dark' | 'light'>('auto');

  const code = $derived(encodePreset(choice));
  const theme = $derived(themeOf(choice, 'custom'));
  const option = (key: Key, id = choice[key]) => OPTIONS[key].find((o: { id: string }) => o.id === id) ?? OPTIONS[key][0];

  // ---- changes, with a history for undo and redo ----
  function commit(next: Choice) {
    if (encodePreset(next) === code) return;
    past = [...past, { ...choice }];
    future = [];
    choice = next;
  }
  const set = (key: Key, id: string) => commit({ ...choice, [key]: id });
  function undo() {
    const last = past.at(-1);
    if (!last) return;
    future = [{ ...choice }, ...future];
    past = past.slice(0, -1);
    choice = last;
  }
  function redo() {
    const [first, ...rest] = future;
    if (!first) return;
    past = [...past, { ...choice }];
    future = rest;
    choice = first;
  }
  const reset = () => commit({ ...DEFAULT });
  // Shuffle changes each choice that is not locked.
  function shuffle() {
    const next = { ...choice };
    for (const key of KEYS as Key[]) {
      if (locks[key]) continue;
      const list = OPTIONS[key];
      next[key] = list[Math.floor(Math.random() * list.length)].id;
    }
    commit(next);
  }
  function toggleMode() {
    const dark = mode === 'dark' || (mode === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.querySelector<HTMLElement>(`[data-mode="${dark ? 'light' : 'dark'}"]`)?.click();
  }

  // ---- the preview ----
  let frame = $state<HTMLIFrameElement>();
  // Goes up each time the preview loads or says it is ready, so the theme is
  // sent again. The first message can come before the preview listens.
  let framePing = $state(0);
  let ready = $state(false);
  $effect(() => {
    if (framePing === 0 || !frame?.contentWindow) return;
    frame.contentWindow.postMessage(
      {
        type: 'fk-theme',
        name: 'custom',
        css: themeCss(theme, true, true),
        mode,
        view,
        label: { base: option('base').name, font: option('font').name, code },
      },
      location.origin,
    );
  });
  // The preset in the URL.
  $effect(() => {
    if (!ready) return;
    const url = new URL(location.href);
    url.searchParams.set('preset', code);
    history.replaceState(null, '', url);
  });

  // ---- dialogs ----
  let presetDialog = $state<HTMLDialogElement>();
  let presetText = $state('');
  let presetError = $state('');
  let codeOpen = $state(false);
  function openPreset() {
    presetText = '';
    presetError = '';
    presetDialog?.showModal();
  }
  function loadPreset(event: SubmitEvent) {
    event.preventDefault();
    const next = decodePreset(presetText);
    if (!next) {
      presetError = 'That is not a preset code. A code looks like f009000.';
      return;
    }
    commit(next as Choice);
    presetDialog?.close();
  }
  let copied = $state(false);
  async function copyPreset() {
    try {
      await navigator.clipboard.writeText(`--preset ${code}`);
      copied = true;
      setTimeout(() => (copied = false), 1500);
    } catch {
      // The code is on the button and in the URL.
    }
  }

  onMount(() => {
    const fromUrl = decodePreset(new URL(location.href).searchParams.get('preset'));
    if (fromUrl) choice = fromUrl as Choice;
    ready = true;
    // The mode of the site (the buttons at the top) is the mode of the preview.
    const root = document.documentElement;
    const readMode = () => (mode = root.classList.contains('dark') ? 'dark' : root.classList.contains('light') ? 'light' : 'auto');
    readMode();
    const observer = new MutationObserver(readMode);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    const onMessage = (event: MessageEvent) => {
      if (event.origin === location.origin && event.data?.type === 'fk-ready') framePing += 1;
    };
    addEventListener('message', onMessage);
    // The preview may be ready before this component is.
    if (frame?.contentDocument?.readyState === 'complete') framePing += 1;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || document.querySelector('dialog[open]')) return;
      const key = event.key.toLowerCase();
      const meta = event.metaKey || event.ctrlKey;
      if (meta && key === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if (meta || event.altKey) return;
      else if (key === 'r' && event.shiftKey) reset();
      else if (key === 'r') shuffle();
      else if (key === 'o') openPreset();
      else if (key === 'd') toggleMode();
      else return;
      event.preventDefault();
    };
    addEventListener('keydown', onKey);
    return () => {
      observer.disconnect();
      removeEventListener('message', onMessage);
      removeEventListener('keydown', onKey);
    };
  });

  // The small mark at the right of a row, and in its menu.
  const tint = (key: Key, o: any) =>
    key === 'text' ? (o.tint ? hex(0.9, Math.max(o.tint.textC * 3, 0), o.tint.textH) : hex(0.9, option('base').recipe.dark.textC * 3, option('base').recipe.dark.textH)) : '';
  const family = (o: any) => (o.sans === 'system' ? 'system-ui, sans-serif' : `"${o.sans}", system-ui, sans-serif`);
</script>

{#snippet mark(key: Key, o: any)}
  {#if key === 'base' || key === 'accent' || key === 'second'}
    <span class="swatch" style="background: {o.swatch}"></span>
  {:else if key === 'text'}
    <span class="aa chip" style="color: {tint(key, o)}; background: {option('base').swatch}">Aa</span>
  {:else if key === 'font'}
    <span class="aa" style="font-family: {family(o)}">Aa</span>
  {:else}
    <span class="tilemark" data-level={o.id}><i></i><i></i><i></i></span>
  {/if}
{/snippet}

<div class="create">
  <aside class="rail" aria-label="Theme choices">
    <div class="section">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger class="fk-pick menu">
          <span class="value">Menu</span>
          <List />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-56" side="right" align="start" sideOffset={8}>
          <DropdownMenu.Item onSelect={openPreset}>Open Preset... <DropdownMenu.Shortcut>O</DropdownMenu.Shortcut></DropdownMenu.Item>
          <DropdownMenu.Item onSelect={shuffle}>Shuffle <DropdownMenu.Shortcut>R</DropdownMenu.Shortcut></DropdownMenu.Item>
          <DropdownMenu.Item onSelect={toggleMode}>Light/Dark <DropdownMenu.Shortcut>D</DropdownMenu.Shortcut></DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={undo} disabled={past.length === 0}>Undo <DropdownMenu.Shortcut>⌘Z</DropdownMenu.Shortcut></DropdownMenu.Item>
          <DropdownMenu.Item onSelect={redo} disabled={future.length === 0}>Redo <DropdownMenu.Shortcut>⇧⌘Z</DropdownMenu.Shortcut></DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={reset}>Reset <DropdownMenu.Shortcut>⇧R</DropdownMenu.Shortcut></DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>

    <div class="choices">
      {#each GROUPS as group (group[0])}
        <div class="section">
          {#each group as key (key)}
            {@const current = option(key)}
            <div class="row" data-locked={locks[key] ? '' : undefined}>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger class="fk-pick">
                  <span class="label">{LABELS[key]}</span>
                  <span class="value">{current.name}</span>
                  <span class="marks">{@render mark(key, current)}</span>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content class="max-h-[70vh] w-52" side="right" align="start" sideOffset={8}>
                  <DropdownMenu.RadioGroup value={choice[key]} onValueChange={(id) => set(key, id)}>
                    {#each OPTIONS[key] as o (o.id)}
                      <DropdownMenu.RadioItem value={o.id}>
                        <span class="marks in-menu">{@render mark(key, o)}</span>
                        {o.name}
                      </DropdownMenu.RadioItem>
                    {/each}
                  </DropdownMenu.RadioGroup>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
              <button
                class="lock"
                type="button"
                aria-label={locks[key] ? 'Unlock' : 'Lock'}
                aria-pressed={!!locks[key]}
                title={locks[key] ? 'Shuffle keeps this choice' : 'Keep this choice when you shuffle'}
                onclick={() => (locks[key] = !locks[key])}
              >
                {#if locks[key]}<Lock />{:else}<LockOpen />{/if}
              </button>
            </div>
          {/each}
        </div>
      {/each}
    </div>

    <div class="section actions">
      <Button variant="outline" class="w-full font-mono" onclick={copyPreset} title="Copy the preset code">
        {copied ? 'copied' : `--preset ${code}`}
      </Button>
      <Button variant="outline" class="w-full" onclick={openPreset}>Open Preset</Button>
      <Button variant="outline" class="w-full" onclick={shuffle}>Shuffle</Button>
    </div>
    <div class="section">
      <Button class="w-full" onclick={() => (codeOpen = true)}>Get Code</Button>
    </div>
  </aside>

  <div class="canvas">
    <iframe bind:this={frame} src="{import.meta.env.BASE_URL}create/preview/" title="Preview of the theme" onload={() => (framePing += 1)}></iframe>
    <div class="views" role="group" aria-label="Preview">
      {#each ['01', '02'] as const as v (v)}
        <button type="button" aria-pressed={view === v} onclick={() => (view = v)}>{v}</button>
      {/each}
    </div>
  </div>
</div>

<dialog class="fk-dialog" bind:this={presetDialog} aria-labelledby="open-preset-title">
  <form onsubmit={loadPreset}>
    <p class="fk-subheading" id="open-preset-title">Open Preset</p>
    <p class="fk-small fk-muted">Paste a preset code to load its choices.</p>
    <div class="field">
      <Label for="preset-code">Preset code</Label>
      <Input id="preset-code" bind:value={presetText} placeholder="f009000" autocomplete="off" spellcheck={false} class="font-mono" />
      <p class="fk-small error" aria-live="polite">{presetError}</p>
    </div>
    <div class="dialog-actions">
      <Button variant="outline" type="button" onclick={() => presetDialog?.close()}>Cancel</Button>
      <Button type="submit">Open</Button>
    </div>
  </form>
</dialog>

<GetCode bind:open={codeOpen} {code} {theme} />

<style>
  .create {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: 14.5rem minmax(0, 1fr);
    gap: var(--fk-space-6);
  }

  /* ---- the rail ---- */
  .rail {
    min-height: 0;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--fk-line);
    background: var(--fk-mantle);
  }
  .section {
    display: flex;
    flex-direction: column;
    gap: var(--fk-space-2);
    padding: var(--fk-space-3);
    border-bottom: 1px solid var(--fk-line);
  }
  .section:last-child {
    border-bottom: 0;
  }
  .choices {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
  .choices .section:last-child {
    border-bottom: 1px solid var(--fk-line);
  }
  .row {
    position: relative;
  }
  /* A row: a small label over the value, and the mark at the right. */
  .rail :global(.fk-pick) {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    width: 100%;
    padding: var(--fk-space-2) var(--fk-space-3);
    border: 1px solid var(--fk-line);
    background: var(--fk-base);
    color: var(--fk-text);
    text-align: left;
    outline: none;
  }
  .rail :global(.fk-pick:hover),
  .rail :global(.fk-pick[aria-expanded='true']) {
    background: var(--fk-hover);
  }
  .rail :global(.fk-pick:focus-visible) {
    border-color: var(--fk-focus);
  }
  .rail :global(.fk-pick.menu) {
    padding-block: var(--fk-space-3);
  }
  .label {
    grid-column: 1;
    color: var(--fk-muted);
    font-size: var(--fk-label-size);
    line-height: var(--fk-label-leading);
  }
  .value {
    grid-column: 1;
    font-size: var(--fk-small-size);
    font-weight: 600;
    line-height: var(--fk-small-leading);
  }
  .marks {
    grid-column: 2;
    grid-row: 1 / span 2;
    display: flex;
    align-items: center;
  }
  .marks.in-menu {
    width: 1.25rem;
    justify-content: center;
  }
  .swatch {
    display: block;
    width: 1rem;
    height: 1rem;
    border: 1px solid var(--fk-line);
  }
  .aa {
    font-size: var(--fk-body-size);
    line-height: 1;
  }
  /* The text color, on the color of the base. */
  .aa.chip {
    padding: 2px 3px;
    font-size: var(--fk-small-size);
  }
  /* Three squares, more of them filled for a deeper tile. */
  .tilemark {
    display: flex;
    gap: 2px;
  }
  .tilemark i {
    width: 5px;
    height: 12px;
    background: var(--fk-overlay);
  }
  .tilemark i:first-child,
  .tilemark[data-level='balanced'] i:nth-child(2),
  .tilemark[data-level='deep'] i {
    background: var(--fk-text);
  }
  /* The lock: at the left of the mark. It shows on hover, and while locked. */
  .lock {
    position: absolute;
    top: 50%;
    right: 2.25rem;
    display: grid;
    place-items: center;
    width: 1.5rem;
    height: 1.5rem;
    transform: translateY(-50%);
    border: 0;
    background: none;
    color: var(--fk-muted);
    opacity: 0;
    cursor: pointer;
  }
  .row:hover .lock,
  .lock:focus-visible,
  .row[data-locked] .lock {
    opacity: 1;
  }
  .row[data-locked] .lock,
  .lock:hover {
    color: var(--fk-text);
  }

  /* ---- the canvas ---- */
  .canvas {
    position: relative;
    min-height: 0;
    border: 1px solid var(--fk-line);
  }
  iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
  }
  .views {
    position: absolute;
    right: var(--fk-space-6);
    bottom: var(--fk-space-4);
    display: flex;
    border: 1px solid var(--fk-line);
    background: var(--fk-mantle);
  }
  .views button {
    padding: var(--fk-space-1) var(--fk-space-3);
    border: 0;
    background: none;
    color: var(--fk-muted);
    font: 500 var(--fk-data-size) / var(--fk-data-leading) var(--fk-font-mono);
    cursor: pointer;
  }
  .views button[aria-pressed='true'] {
    background: var(--fk-text);
    color: var(--fk-base);
  }

  /* ---- dialogs ---- */
  :global(.fk-dialog) {
    /* Tailwind's reset takes away the margin that centers a dialog. */
    margin: auto;
    width: min(28rem, calc(100vw - 2 * var(--fk-space-4)));
    padding: var(--fk-space-6);
    border: 2px solid var(--fk-text);
    background: var(--fk-base);
    color: var(--fk-text);
  }
  :global(.fk-dialog::backdrop) {
    background: color-mix(in srgb, var(--fk-deep) 70%, transparent);
    backdrop-filter: blur(6px);
  }
  .fk-dialog p {
    margin: 0;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: var(--fk-space-2);
    margin-top: var(--fk-space-4);
  }
  .error {
    min-height: var(--fk-small-leading);
    color: var(--fk-status-error);
  }
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--fk-space-2);
    margin-top: var(--fk-space-2);
  }

  /* On a narrow window the page scrolls: the rail, then the preview. */
  @media (max-width: 900px) {
    .create {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto 80vh;
    }
    .choices {
      overflow: visible;
    }
  }
</style>
