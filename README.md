# SceneScout QA sandbox

A small, deliberately imperfect web app used as a live test bed for
[SceneScout](https://github.com/brunoboto96/SceneScout)'s `/scenescout qa`
pull-request command. Every pull request gets its own deployed preview on
Cloudflare Pages, and a comment on the pull request asks SceneScout to test it.

**This is a sandbox.** The content is invented placeholder data and the app
contains seeded defects on purpose. Do not fix them unless you mean to change
what the sandbox tests.

## The app

Static pages in `public/` plus Cloudflare Pages Functions in `functions/api/`.
No build step and no runtime dependencies.

| Page | What it does |
| --- | --- |
| `/` | Home page with the navigation |
| `/items` | Loads `GET /api/items` into a table, and shows an error if the call fails |
| `/archived` | Loads `GET /api/archived` into a table |
| `/form` | A "New item" form with a **Save** and a **Cancel** button |

Interactive elements carry stable `data-testid` attributes.

### Seeded defects

- `GET /api/archived` always answers 500, and the archived page shows an empty
  table with no error message: the page reads as "nothing archived" when the
  server refused the request.

## Run it locally

```sh
npx -y wrangler@4.146.0 pages dev public
```

Serves the pages and the functions on http://localhost:8788.

## Deployments

`.github/workflows/deploy-preview.yml` deploys with Wrangler to the Pages
project `scenescout-sandbox-qa`, which must already exist with `main` as its
production branch:

- a push to `main` deploys production, https://scenescout-sandbox-qa.pages.dev
- a pull request from a branch of this repository deploys a branch preview,
  `https://<branch>.scenescout-sandbox-qa.pages.dev` (the branch name lowercased,
  anything not a letter or digit replaced by `-`, cut to 28 characters), then records a GitHub
  Deployment in the `preview` environment on the head commit, whose status
  carries that URL. That deployment is how the QA gate finds the preview.
- pull requests from forks are not deployed.

## Using the QA command

`.github/workflows/scenescout-qa.yml` is SceneScout's QA template, unchanged
apart from the release it is pinned to. Comment on a pull request:

| Comment | What you get |
| --- | --- |
| `/scenescout qa` | An exploratory report on the pull request's preview |
| `/scenescout qa show the Save button` | A picture of that element on the preview |
| `/scenescout qa compare the Save button` | That element on production and on the preview, with the changed pixels marked |

The `restyle-save` branch changes only the Save button's colours, so a pull
request from it gives `compare` something to show.

## Configuration

Names only; values are set in the repository settings, never in files.

Secrets:

| Name | Used by |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | deploy-preview: a token allowed to deploy to Cloudflare Pages |
| `CLOUDFLARE_ACCOUNT_ID` | deploy-preview |
| `OPENAI_API_KEY` | scenescout-qa: the model key, held only by the job that runs SceneScout |
| `SCENESCOUT_QA_TEAM_TOKEN` | scenescout-qa, optional: only when allowing by team |

Variables:

| Name | Value here |
| --- | --- |
| `SCENESCOUT_QA_ENVIRONMENT` | `preview` (only deployments to this environment count as the preview) |
| `SCENESCOUT_QA_BASE_URL` | `https://scenescout-sandbox-qa.pages.dev` (what `compare` compares the preview with) |
| `SCENESCOUT_QA_ALLOWED` | optional: logins allowed to start a run |
| `SCENESCOUT_QA_ALLOWED_ROLES` | optional: repository roles allowed to start a run |
| `SCENESCOUT_QA_ALLOWED_TEAMS` | optional: `org/team-slug` entries, with the team token |
| `SCENESCOUT_QA_ALLOW_FORKS` | optional: leave unset so fork pull requests are refused |
| `SCENESCOUT_QA_PREVIEW_URL` | optional: leave unset so the deployment above is used |

What each variable means in full is in SceneScout's `docs/ci.md`, section
"A QA review from a pull-request comment".
