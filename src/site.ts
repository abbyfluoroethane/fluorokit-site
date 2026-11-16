// What the pages share: the nav, and the themes read from the kit.
import allThemes from 'fluorokit/themes.json';

// In display order. The page-enter comes from the side a page lies on.
/** A path on this site, under the base path (on GitHub Pages, the repo name). */
export const url = (path: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + path;

export const NAV = [
  { href: url('/'), name: 'home' },
  { href: url('/components/'), name: 'components' },
  { href: url('/themes/'), name: 'themes' },
  { href: url('/create/'), name: 'create' },
];

/** One line for each theme, for this site. */
export const BLURBS: Record<string, string> = {
  ink: 'Near-black with a hint of blue.',
  blueberry: 'Saturated blue.',
  twilight: 'Deep violet.',
  cobalt: 'Bright blue.',
  catppuccin: 'Catppuccin Mocha and Latte with a pink accent.',
  zune: 'Neutral greys, magenta to orange, set in Selawik.',
};

interface Mode {
  colorScheme: 'light' | 'dark';
  colors: Record<string, string>;
}
export interface Theme {
  name: string;
  description: string;
  default: string;
  print?: string;
  tiles?: Record<string, string>;
  modes: Record<string, Mode>;
}

const ORDER = ['ink', 'blueberry', 'twilight', 'cobalt', 'catppuccin', 'zune'];
export const THEMES = (allThemes as Theme[]).toSorted((a, b) => ORDER.indexOf(a.name) - ORDER.indexOf(b.name));

/** The name of a theme's mode for a color scheme: "freon" for ink dark. */
export const modeName = (theme: Theme, scheme: 'light' | 'dark') =>
  Object.keys(theme.modes).find((key) => key !== theme.print && theme.modes[key].colorScheme === scheme);
