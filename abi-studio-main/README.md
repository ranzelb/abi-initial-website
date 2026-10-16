# ABI — Built for what’s next

A responsive website redesign concept for Actuate Builders Incorporated, inspired by the supplied animated references. Includes an original Three.js architectural model, material transitions, exploded floor plates, drag-to-rotate interaction, light and dark themes, a project portfolio, service accordions, an interactive client workspace demonstration, document downloads, and an email inquiry composer.

## Preview

Run `python -m http.server 4174 --directory dist` in this directory, then visit `http://localhost:4174`. Serve over HTTP rather than opening index.html directly because the 3D renderer uses JavaScript modules.

There is no build step. The deployable website is in `dist/`; Three.js is vendored locally. Fonts use Google Fonts with system fallbacks.

## Content and scope

- Company history, services, contact details, and selected projects are based on https://abi-ph.com/ and its published portfolio.
- Project photography is from ABI’s published project imagery. Original case studies are linked from the site.
- The 3D building is an original illustrative architectural concept, not an existing ABI project.
- Workspace projects, milestones, progress, and downloadable text documents are explicitly illustrative. This demonstration has no authentication or live project database.
- The inquiry form creates a mailto link. It does not send messages or store personal details.
- Only the theme preference persists in browser local storage.

## Checks

`node --check dist/app.js` and `node --check dist/scene.js` validate JavaScript syntax. Browser visual and interaction checks remain pending because local preview was blocked by browser security policy in the authoring environment.

The Sites identity and static deployment configuration are retained in `.openai/hosting.json`.

## Construction animation update

The scene includes eight articulated workers, exposed structural floors, temporary edge rails and scaffolding, a slewing crane with hoist and load, a concrete mixer following a curved site route, an articulated excavator, a tipper, cones, tools, a wheelbarrow, and staged materials. Workers and scaffold segments stay attached to their floor plates in exploded view. Motion can be paused and starts paused for reduced-motion preferences. Static geometry is batched to reduce draw calls.

Original checkpoint: `../checkpoints/abi-original-2026-10-16.zip` and Git tag `checkpoint-original-2026-10-16` (commit `663407584245cfddd30a58864dd6cd94ba0b5602`). Hosted version 1 also retains the original.

## Deploying to Vercel

This is a static site with no build step. `vercel.json` tells Vercel to serve the `dist/` folder.

1. Push this folder to a GitHub repo (keep `vercel.json` at the repo root).
2. In Vercel, choose **Add New → Project** and import the repo.
3. Leave Framework Preset as **Other**; the build command and install command stay empty. Output Directory is read from `vercel.json` (`dist`).
4. Click **Deploy**.

Or from the CLI: `npx vercel --prod` in this folder.
