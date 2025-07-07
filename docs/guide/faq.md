# Frequently Asked Questions

## When should I use this plugin?
### Use this plugin if:
- You want to embed Svelte in a legacy or non-Svelte app (like PHP, Rails, WordPress, etc.)
- You want simple, isolated UI widgets that drop into existing markup
- You want to avoid full frontend rewrites
### Do not use this plugin if:
- You're building a new Svelte app (just use [SvelteKit](https://svelte.dev/docs/kit) or Vite + Svelte)

## Can custom elements share state?
Yes. Declare your shared state in a [.svelte.js or .svelte.ts file](https://svelte.dev/docs/svelte/svelte-js-files) 
and import it to your components. Look at the [Number Translator](/demo#number-translator) as an example. 

## What does "anywhere" really mean?
**Anywhere HTML is accepted**: legacy codebases, server-rendered sites, CMS platforms, even raw PHP or WordPress pages. If it can handle a `<script>` and `<custom-element>`, it can handle Svelte components.

## What does this plugin even do?
Svelte Anywhere doesn’t invent a new runtime, it streamlines what Svelte already supports (custom elements).
It adds a layer of:
- **Developer automation**: auto-generates templates and discovers components
- **Annotation-based config**: easily define tag names, templates, and shadow DOM settings right in your component
- **Vite-integrated output**: clean build output with custom directories, manifest support, and production-ready assets

Worried about long-term support? No problem — the plugin’s output is just standard Svelte code. You can commit the generated files to your repo, remove the plugin, and everything will still work.