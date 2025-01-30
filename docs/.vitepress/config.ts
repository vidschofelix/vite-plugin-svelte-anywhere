import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Svelte Anywhere Docs",
  description: "A VitePress Site",
  head: [
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      ['script', { src: '/demo/main-DWuT2Htv.js', type: 'module' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'What is Svelte Anywhere?', link: '/what-is-svelte-anywhere' }
    ],
    logo: '/logo.png',

    sidebar: [
      {
        text: 'What is Svelte Anywhere?',
        link: '/what-is-svelte-anywhere'
      },
      {
        text: 'Demos',
        items: [
          { text: 'Simple Examples', link: '/demo/simple' },
          { text: 'Shared State Examples', link: '/demo/shared-state' },
          { text: 'Tailwind Examples', link: '/demo/tailwind' }
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Quickstart', link: '/guide/quickstart' },
          { text: 'Advanced Usage', link: '/guide/advanced-usage' },
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
    //   pattern: 'https://github.com/vidschofelix/vite-plugin-svelte-anywhere/main/docs/:path',
    //   text: 'Edit this page on GitHub'
    // },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vidschofelix/vite-plugin-svelte-anywhere' }
    ]
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.includes('-'), //register custom components
      },
    },
  },
  base: '/repo/'
})
