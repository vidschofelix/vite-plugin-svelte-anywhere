import {defineConfig} from 'vitepress'
import {readFile} from "node:fs/promises";
import llmstxt from 'vitepress-plugin-llms'
// https://vitepress.dev/reference/site-config


const basePath = ''
const demoBasePath = `${basePath}/demo/`

const headers_to_inject =  (async()=> {
  const manifest = JSON.parse(await readFile("docs/public/demo/.vite/manifest.json", "utf8"));
  let headers = []
  if (process.env.NODE_ENV === 'development') {
    headers.push(...[[
      'script',
      { src: `http://localhost:5173${demoBasePath}@vite/client`, type: 'module' }
    ],
      [
        'script',
        { src: `http://localhost:5173${demoBasePath}src/main.ts`, type: 'module' }
      ]
    ])
  } else {
    headers.push([
      'script',
      { src: `${demoBasePath}${manifest['src/main.ts']['file']}`, type: 'module' }
    ])
    manifest['src/main.ts']['css'].map((entry: string) => {
      headers.push([
        'link ',
        { href: `${demoBasePath}${entry}`, rel: 'stylesheet' }
      ])
    })
  }
  return headers
})()

export default defineConfig({
  title: "Svelte Anywhere Docs",
  description: "Use Svelte components anywhere",
  head: [
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'en' }],
    ['meta', { property: 'og:title', content: 'Svelte Anywhere | Use Svelte components anywhere' }],
    ['meta', { property: 'og:site_name', content: 'Svelte Anywhere' }],
    ['meta', { property: 'og:url', content: 'https://vidschofelix.github.io/vite-plugin-svelte-anywhere/' }],
    ['link', { rel: 'canonical', href: 'https://svelte-anywhere.dev/' }],
    ['link', { rel: 'shortcut icon', href: `${basePath}favicon.ico` }],
    ['link', { rel: 'icon', type: 'image/png', href: `${basePath}favicon-96x96.png`, sizes: '96x96'}],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${basePath}favicon.svg`}],
    ['link', { rel: 'apple-touch-icon', sizes: '96x96', href: `${basePath}apple-touch-icon.png`}],

    ...await headers_to_inject
  ],
  vite:{ //in case you have issues with the page doing a full reload while working on the demo, uncomment this
    server: {
      port: 5170,
      hmr: true,
    },
    plugins: [
      llmstxt() as any
    ]
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Reference', link: '/reference/plugin' }
    ],
    logo: '/logo.png',

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is Svelte Anywhere', link: '/what-is-svelte-anywhere'},
          { text: 'Demos', link: '/demo'},
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Quickstart', link: '/guide/quickstart' },
          { text: 'FAQ', link: '/guide/faq' },
          { text: 'Backend Integration', link: '/guide/backend-integration'},
          { text: 'Using Custom Templates', link: '/guide/custom-templates' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Plugin Config', link: '/reference/plugin' },
          { text: 'Component Config', link: '/reference/component' },
        ]
      }
    ],
    search: {
      provider: 'local'
    },
    // editLink: {
    //   pattern: 'https://github.com/vidschofelix/vite-plugin-svelte-anywhere/tree/main/docs/:path',
    //   text: 'Edit this page on GitHub'
    // },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vidschofelix/vite-plugin-svelte-anywhere' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/vite-plugin-svelte-anywhere' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present'
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.includes('-'), //register custom components
      },
    },
  },
  base: basePath
})
