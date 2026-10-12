# roam2gether — Rome2Rio group trip planner (prototype)

Vanilla JavaScript (ES modules), HTML and CSS. No framework, no build step, no backend.
All "AI", prices and collaboration are curated or simulated.

## Run it

ES modules don't load from `file://`, so serve the folder:

```bash
npm start            # → http://localhost:8080  (uses npx serve)
# or
python3 -m http.server 8080
```

If you open `index.html` directly you'll see a short message explaining this.

## Where things live

| Folder | What it holds |
| --- | --- |
| `js/main.js` | Entry point: registers views, actions, hooks; boots the app |
| `js/data/` | Static content: quiz, destinations, follow-ups, plan suggestions |
| `js/state/store.js` | `state` (saved to localStorage) and `ui` (transient) |
| `js/logic/` | Scoring, crew stats, planner helpers — no HTML |
| `js/views/` | Functions returning HTML strings, one per screen (`results/`, `plan/` split by section) |
| `js/actions/` | Click handlers named after `data-action` attributes |
| `js/render.js`, `js/events.js` | Drawing the current screen, global event wiring |
| `css/` | Styles split by screen |

## Making a change

- **Edit copy / a section:** find the view function (e.g. `views/plan/flightsSection.js`).
- **Add a button:** put `data-action="myAction"` in the markup, add `myAction` to an object in `js/actions/`.
- **Tweak scoring:** `js/logic/scoring.js` and trait values in `js/data/destinations.js`.
- **Reset saved state:** "Demo → Reset prototype", or clear `roameo.proto.v2` in localStorage.

If a screen throws, an error panel with the stack trace and a Reset button is shown instead of a blank page.

Format with `npm run format`.
# roam2gether
