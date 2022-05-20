// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Quran & Hadith',
  tagline: 'Multiple Languages & Multiple Gradings',
  url: 'https://fawazahmed0.github.io',
  baseUrl: '/quran-hadith-search/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/original-icon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'fawazahmed0', // Usually your GitHub org/user name.
  projectName: 'quran-hadith-search', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/fawazahmed0/quran-hadith-search/edit/gh-pages/docsdata/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/fawazahmed0/quran-hadith-search/edit/gh-pages/docsdata/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'QuranHadiths',
        logo: {
          alt: 'Books',
          src: 'img/original-icon.ico',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Books',
          },
          {
            href: 'https://github.com/fawazahmed0/quran-hadith-search',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Books',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Islamic Apps',
                href: 'https://fawazahmed0.github.io/islamic-project/',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/fawazahmed0/quran-hadith-search',
              },
            ],
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
    themes: [
      // ... Your other themes.
      [
        require.resolve("@easyops-cn/docusaurus-search-local"),
        {
          // ... Your options.
          // `hashed` is recommended as long-term-cache of index file is possible.
          hashed: true,
          // For Docs using Chinese, The `language` is recommended to set to:
          // ```
          language: ["en","ar", "zh"],
          // ```
        },
      ],
    ],
    plugins: [
      [
        '@docusaurus/plugin-pwa',
        {
          pwaHead:[
            {
              tagName: 'link',
              rel: 'icon',
              href: '/img/512x512.png',
            },
            {
              tagName: 'link',
              rel: 'manifest',
              href: '/manifest.json', // your PWA manifest
            },
            {
              tagName: 'meta',
              name: 'theme-color',
              content: '#007bff',
            },
            {
              tagName: 'meta',
              name: 'apple-mobile-web-app-capable',
              content: 'yes',
            },
            {
              tagName: 'meta',
              name: 'apple-mobile-web-app-status-bar-style',
              content: '#007bff',
            },
            {
              tagName: 'link',
              rel: 'apple-touch-icon',
              href: '/img/512x512.png',
            },
            {
              tagName: 'meta',
              name: 'msapplication-TileImage',
              content: '/img/512x512.png',
            },
            {
              tagName: 'meta',
              name: 'msapplication-TileColor',
              content: '#007bff',
            },
          ]
        }
      ],
    ],
};

module.exports = config;
