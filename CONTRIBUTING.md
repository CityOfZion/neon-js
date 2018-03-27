# Contributing

Thank you for reading this file. Do adhere to these guidelines as much as possible so everyone can have a good time :)

## How to contribute

### Open an issue

  Do open an issue so that everyone knows what is happening. This reduces the chance of double work and allows everyone, new or old, to join in the discussion and development.

### Scope your work

  Scope your work such that it can be described within 1 commit message. This is important as we will be squashing your commits when merging and thus, you will only have one commit message to work with.

  We are going to adhere to Conventional Commits style for commit messages so this is a good guideline for it.

  [Conventional Commits](https://conventionalcommits.org/)

### Work on `dev`

  All our development work in progress happens on the `dev` branch. During development:

  - Ensure code is formatted through `npm run lint`.
  - Ensure tests pass through `npm run test:unit`.
  - If modifying typings, check it through `npm run test:typings`.

  Just before you submit, you can run `npm run test` to run integration tests together. We do not encourage running integration tests in `watch` mode or everytime as it performs real transactions on the blockchain and should be reserved for the final step.

  There is no need to squash your work as we will do that when the maintainer merges the PR.

### Submit your PR

  Title your PR with a conventional commit message as such:

  ```
  type(scope):desc
  ```
  Type can be `fix`, `feat`, `docs`, `test` or `refactor`. This list is not exhaustive.

  Scope is the package folder that you are focusing on, `api`, `sc`, `wallet`, etc.

  Describe your changes within a short sentence. If there are breaking changes, Do start with `BREAKING CHANGE`.

### And you are done!
