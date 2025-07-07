![logo](docs/public/logo.png)

# Vite Plugin: Svelte Anywhere

[![NPM Version](https://img.shields.io/npm/v/vite-plugin-svelte-anywhere)](https://www.npmjs.com/package/vite-plugin-svelte-anywhere)
[![Bundle Size](https://img.shields.io/bundlephobia/min/vite-plugin-svelte-anywhere)](https://bundlephobia.com/package/vite-plugin-svelte-anywhere)
[![NPM Downloads](https://img.shields.io/npm/d18m/vite-plugin-svelte-anywhere)](https://img.shields.io/npm/d18m/vite-plugin-svelte-anywhere)
[![Build Status](https://github.com/vidschofelix/vite-plugin-svelte-anywhere/actions/workflows/release.yml/badge.svg)](https://github.com/vidschofelix/vite-plugin-svelte-anywhere/actions)
[![License](https://img.shields.io/github/license/vidschofelix/vite-plugin-svelte-anywhere)](https://github.com/vidschofelix/vite-plugin-svelte-anywhere/blob/main/LICENSE)

**Use Svelte components anywhere HTML is accepted.**

This Vite plugin lets you define **custom elements** right inside your Svelte components—just add an annotation, and you're ready to embed them in any environment, from static HTML to legacy backends or CMS platforms.

No boilerplate. No runtime shenanigans. Just Svelte, anywhere.

---

### Features

- 🧩 **Custom Elements from Svelte** — Turn any Svelte component into a reusable HTML element with a single comment.
- 🛠 **Zero Boilerplate** — No manual registration or wrapper code.
- 🔁 **Dev + Prod Ready** — Works with Vite HMR dev server and production builds
- 🌓 **Shadow DOM Control** — Opt-in or out with simple config.
- ⚡ **Lazy/Eager/Custom Templates** — Choose how your components are loaded.

---

### Links

- 📚 [Documentation](https://svelte-anywhere.dev)
- ✨ [Quickstart Guide](https://svelte-anywhere.dev/guide/quickstart)
- 🎮 [Live Demo](https://svelte-anywhere.dev/demo)

---

### Quick Example

```svelte
<!-- @custom-element my-counter shadow="open" template="lazy" -->
<script>
  let { count = 0 } = $props();
</script>

<button onclick={() => count++}>
  Clicked {count} times
</button>
```

Now just use it anywhere:
```html
<my-counter count="5"></my-counter>
```
