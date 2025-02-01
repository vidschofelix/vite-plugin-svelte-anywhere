import {defineConfig} from 'vitepress'
import {readFile} from "node:fs/promises";

// https://vitepress.dev/reference/site-config


const basePath = '/vite-plugin-svelte-anywhere/'
// @ts-ignore
const manifest = JSON.parse(await readFile("docs/public/demo/.vite/manifest.json", "utf8"));

export default defineConfig({
  title: "Svelte Anywhere Docs",
  description: "A VitePress Site",
  head: [
    ['link', { rel: 'icon', href: `${basePath}favicon.ico` }],
  ],
  transformPageData(pageData) {
    pageData.frontmatter.head ??= []
    if (process.env.NODE_ENV === 'development') {
      pageData.frontmatter.head.push(...[[
          'script',
         { src: 'http://localhost:5173/@vite/client', type: 'module' }
        ],
        [
          'script',
          { src: 'http://localhost:5173/src/main.ts', type: 'module' }
        ]
      ])
    } else {
      pageData.frontmatter.head.push([
        'script',
        { src: `${basePath}demo/${manifest['src/main.ts']['file']}`, type: 'module' }
      ])
      manifest['src/main.ts']['css'].map((entry) => {
        pageData.frontmatter.head.push([
          'link ',
          { href: `${basePath}demo/${entry}`, rel: 'stylesheet' }
        ])
      })
    }
  },
  // vite:{ //in case you have issues with the page doing a full reload while working on the demo, uncomment this
  //   server: {
  //     hmr: false
  //   },
  // },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Reference', link: '/reference/plugin' }
    ],
    logo: '/logo.png',

    sidebar: [
      {
        text: 'What is Svelte Anywhere?',
        link: '/what-is-svelte-anywhere'
      },
      {
        text: 'Demos',
        link: '/demo'
      },
      {
        text: 'Guides',
        items: [
          { text: 'Quickstart', link: '/guide/quickstart' },
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
    ]
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
