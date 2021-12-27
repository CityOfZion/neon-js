module.exports = {
  title: "neon-js",
  tagline: "JS SDK for NEO3 blockchain",
  url: "https://docs.coz.io",
  baseUrl: "/neo3/neon-js/",
  organizationName: "cityofzion",
  projectName: "neon-js",
  scripts: [
    "https://buttons.github.io/buttons.js",
    // "https://unpkg.com/@cityofzion/neon-js@next",
  ],
  favicon: "img/favicon.png",
  customFields: {
    users: [
      {
        caption: "Neon Wallet",
        image:
          "https://github.com/CityOfZion/neon-wallet/blob/dev/icons/png/512x512.png?raw=true",
        infoLink: "http://neonwallet.com/",
        pinned: true,
      },
    ],
    repoUrl: "https://github.com/cityofzion/neon-js",
  },
  onBrokenLinks: "log",
  onBrokenMarkdownLinks: "log",
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          path: "../docs",
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: false,
        theme: {
          customCss: "../src/css/customTheme.css",
        },
      },
    ],
  ],
  plugins: [
    [
      "@docusaurus/plugin-client-redirects",
      {
        fromExtensions: ["html"],
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: "neon-js",
      logo: {
        src: "img/logo.svg",
      },
      items: [
        {
          to: "docs/",
          label: "Docs",
          position: "left",
        },
        {
          to: "docs/api",
          label: "API",
          position: "left",
        },
        {
          to: "docs/changelog/latest",
          label: "Changelog",
          position: "left",
        },
        {
          to: "/help",
          label: "Help",
          position: "left",
        },
      ],
    },
    footer: {
      links: [],
      copyright: "Copyright © 2021 Ethan Fast, Yak Jun Xiang",
      logo: {
        src: "img/logo.svg",
      },
    },
  },
};
