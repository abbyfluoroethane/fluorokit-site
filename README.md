# fluorokit-site

The showcase and theme builder for
[fluorokit](https://github.com/abbyfluoroethane/fluorokit), a Metro theme
for shadcn-svelte. Four pages: home, components (stock shadcn-svelte
components under the current theme, plus the Metro extras), themes, and
create (a theme builder modelled on shadcn's).

## Develop

The site expects the fluorokit repo beside it, built:

```sh
cd ../fluorokit && npm run build
cd ../fluorokit-site && npm install && npm run dev   # http://localhost:4323
```

## Deploy

`.github/workflows/deploy.yml` builds the kit and the site and publishes to
GitHub Pages. In the repo settings, set Pages to deploy from GitHub Actions.
It is live at <https://bigaouette.com/fluorokit-site/> (the account's Pages
custom domain, with the repo name as the path).
