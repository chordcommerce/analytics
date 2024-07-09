# Hydrogen template: Skeleton

Hydrogen is Shopify’s stack for headless commerce. Hydrogen is designed to dovetail with [Remix](https://remix.run/), Shopify’s full stack web framework. This template contains a **minimal setup** of components, queries and tooling to get started with Hydrogen.

[Check out Hydrogen docs](https://shopify.dev/custom-storefronts/hydrogen)
[Get familiar with Remix](https://remix.run/docs/en/v1)

## What's included

- Remix
- Hydrogen
- Oxygen
- Vite
- Shopify CLI
- ESLint
- Prettier
- GraphQL generator
- TypeScript and JavaScript flavors
- Minimal setup of components and routes

## Getting started

Link the project to your Shopify store, as described [here].

[here]: https://shopify.dev/docs/storefronts/headless/hydrogen/getting-started#step-3-link-your-hydrogen-project-to-shopify

## Local development

```bash
yarn dev
```

## Building for production

```bash
yarn build
```

## Deployment

```bash
npx shopify hydrogen deploy
```

## Setup for using Customer Account API (`/account` section)

Follow step 1 and 2 of <https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen#step-1-set-up-a-public-domain-for-local-development>

---

Steps:

- asdf install nodejs 21.7.3
- yarn
