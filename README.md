# 🐻 Benefits Eligibility - Phase 4

[![usagov-benefits-eligibility](https://github.com/GSA/usagov-benefits-eligibility/actions/workflows/main.yml/badge.svg)](https://github.com/GSA/usagov-benefits-eligibility/actions/workflows/main.yml)
[![CodeQL](https://github.com/GSA/usagov-benefits-eligibility/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/GSA/usagov-benefits-eligibility/actions/workflows/codeql-analysis.yml)
[![MegaLinter](https://github.com/GSA/usagov-benefits-eligibility/actions/workflows/megalinter.yml/badge.svg)](https://github.com/GSA/usagov-benefits-eligibility/actions/workflows/megalinter.yml)
[![Semgrep](https://github.com/GSA/usagov-benefits-eligibility/actions/workflows/semgrep.yml/badge.svg)](https://github.com/GSA/usagov-benefits-eligibility/actions/workflows/semgrep.yml)
[![woke](https://github.com/GSA/usagov-benefits-eligibility/actions/workflows/woke.yml/badge.svg)](https://github.com/GSA/usagov-benefits-eligibility/actions/workflows/woke.yml)

BEARS will be a proactive notification service that provides
timely and personalized information about benefits
eligibility, contextualized by life events. Before we can
do notifications and potentially proactive notifications,
we need to be able to estimate eligibility and figure out a
way to get people to sign up and store their information.
We also need to establish relationships with benefits
programs so we can keep eligibility information up to date.

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate

# federalist build
$ npm run federalist

# federalist local build
$ npm run federalist:local

# specs
$ npm run test
$ npm run test:watch

# you may want to look at additional scripts available in the package.json
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

### Useful links

- [https://nuxtjs.org/](https://nuxtjs.org/)
- [https://webpack.js.org/](https://webpack.js.org)
- [https://jestjs.io/](https://jestjs.io/)
- [https://federalistapp.18f.gov/]( https://federalistapp.18f.gov/)
- [https://federalist.18f.gov/documentation/]( https://federalist.18f.gov/documentation/)

### Github Actions

- .github/workflows/main.yml - Builds, tests the BEARS site.
- .github/workflows/codeql-analysis.yml - Scans for code quality and
  security issues in the BEARS site and it's dependencies.

### Federalist builds

- [https://federalistapp.18f.gov/sites/983/builds](https://federalistapp.18f.gov/sites/983/builds)

## Design considerations

- Some items we only render client-side this is because the data
  relationships are not fully captured by [Nuxt.js](<(https://nuxtjs.org)>)
  and by moving them client-side [Vue.js](https://vuejs.org/)
  is able to track those relationships.
- The current print philosophy is that print is a different
  artifact than a web page, be sure to test printing after any
  website changes.
- There are some integration issues between
  [USWDS](https://designsystem.digital.gov/) components and
  [Vue.js](https://vuejs.org/). The current approach tries
  to use each framework by it's public API's as much as possible.
