/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'User1',
    image: '/test-site/img/docusaurus.svg',
    infoLink: 'https://www.facebook.com',
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
  headerIcon: 'img/docusaurus.svg',
  footerIcon: 'img/docusaurus.svg',
  favicon: 'img/favicon.png',
  /* colors for website */
  colors: {
    primaryColor: '#2E8555',
    secondaryColor: '#205C3B'
  },
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    ' Ethan Fast, Yak Jun Xiang',
  organizationName: 'snowypowers', // or set an env variable ORGANIZATION_NAME
  projectName: 'neon-js', // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'dracula'
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/cityofzion/neon-js'
}

module.exports = siteConfig
