// What the components page shows, in order. Each entry is a demo in
// src/demos; the code tab shows the demo's source.
export interface Entry {
  id: string;
  name: string;
  note?: string;
}

/** Stock shadcn-svelte components. The theme styles them; their code is unchanged. */
export const SHADCN: Entry[] = [
  { id: 'button', name: 'Button' },
  { id: 'input', name: 'Input' },
  { id: 'switch', name: 'Switch' },
  { id: 'slider', name: 'Slider' },
  { id: 'progress', name: 'Progress' },
  { id: 'separator', name: 'Separator' },
  { id: 'skeleton', name: 'Skeleton' },
  { id: 'tooltip', name: 'Tooltip' },
  { id: 'dropdown-menu', name: 'Dropdown menu' },
  { id: 'context-menu', name: 'Context menu', note: 'Right-click the box.' },
  { id: 'alert-dialog', name: 'Alert dialog' },
  { id: 'scroll-area', name: 'Scroll area' },
];

/** What the theme adds: classes in base.css, and one Svelte component. */
export const EXTRAS: Entry[] = [
  { id: 'type', name: 'Type', note: 'Each class sets size, line height, weight and tracking together.' },
  { id: 'pivot', name: 'Pivot', note: 'Clicking a header sets the side the next page slides in from. On a site of separate pages, a nav of links with the same classes does the same thing (see the code tab).' },
  { id: 'page-enter', name: 'Page enter', note: '--i staggers siblings; --fk-enter-dir picks the side.' },
  { id: 'tiles', name: 'Tiles', note: 'Square, wide or large. The fills come from the theme.' },
  { id: 'status', name: 'Status' },
  { id: 'energy-bar', name: 'Energy bar', note: 'The one gradient. Use it once per view at most.' },
];

const sources = import.meta.glob<string>('./demos/*.svelte', { eager: true, query: '?raw', import: 'default' });
export const demoSource = (id: string) => sources[`./demos/${id}.svelte`].trim();
