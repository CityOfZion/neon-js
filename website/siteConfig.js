/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'Neon Wallet',
    image: 'https://github.com/CityOfZion/neon-wallet/blob/dev/icons/png/512x512.png?raw=true',
    infoLink: 'http://neonwallet.com/',
    pinned: true
  }
]

const siteConfig = {
  title: 'neon-js' /* title for your website */,
  tagline: 'JS SDK for NEO blockchain',
  url: 'http://cityofzion.io' /* your website url */,
  baseUrl: '/neon-js/' /* base url for your project */,
  projectName: 'neon-js',
  headerLinks: [
    { doc: 'installation', label: 'Docs' },
    { doc: 'api-index', label: 'API' },
    { page: 'help', label: 'Help' },
    { languages: true }
  ],
  users,
  /* path to images for header/footer */
  headerIcon: 'img/neon_small.png',
  footerIcon: 'img/neon_small.png',
  favicon: 'img/favicon.png',
  /* colors for website */
  colors: {
    primaryColor: '#2b2b5e',
    secondaryColor: '#212146'
  },
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    ' Ethan Fast, Yak Jun Xiang',
  organizationName: 'snowypowers', // or set an env variable ORGANIZATION_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'dracula'
  },
  scripts: ['https://buttons.github.io/buttons.js', '/neon-js/browser.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/cityofzion/neon-js'
}

module.exports = siteConfig
