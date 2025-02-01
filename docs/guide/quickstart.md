# Getting Started with Svelte-Anywhere

## Installation

First, install the plugin as a development dependency in your project:

::: code-group
```sh [npm]
$ npm install vite-plugin-svelte-anywhere -D
```
```sh [pnpm]
$ pnpm install vite-plugin-svelte-anywhere -D
```

```sh [yarn]
$ yarn add vite-plugin-svelte-anywhere -D
```
:::

## Configuration

### 1. Update the vite config
Add vite-plugin-svelte-anywhere to your Vite configuration. 
> [!IMPORTANT]
> Make sure `svelteAnywhere` is positioned above the `svelte()`-plugin.

::: code-group
```ts [vite.config.ts]
import svelteAnywhere from 'vite-plugin-svelte-anywhere'; // [!code ++]
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default {
  plugins: [
    svelteAnywhere(), // [!code ++]
    svelte({
      compilerOptions: { // [!code ++]
        customElement: true, // [!code ++]
      }, // [!code ++]
    }),
  ],
  build: { // [!code ++]
    manifest: true, // Generate manifest.json for production // [!code ++]
    rollupOptions: { // [!code ++]
      input: './src/main.ts', // Override default .html entry // [!code ++]
    }, // [!code ++]
  }, // [!code ++]
};
```
:::

### 2. Load Custom Elements in main.ts
Use Vite’s import.meta.glob to load your custom elements automatically.
``` ts 
import.meta.glob('./generated/custom-element/*', { eager: true });
```

### 3. Annotate Your Svelte Components
::: code-group
```svelte [src/lib/MyComponent.svelte]{1}
<!-- @custom-element my-component -->
<script>
  let { message = 'Hello!' } = $props();
</script>

<div>{message}</div>
```
:::
The annotation creates a custom element `<my-component>` that you can use anywhere.

### 4. Embed Custom Elements
:::code-group
``` html [index.html] 
<!DOCTYPE html>
<html>
<head>
   <script type='module' src='http://localhost:5173/@vite/client'></script> <!--[!code ++]-->
   <script type="module" src="http://localhost:5173/src/main.ts"></script>  <!--[!code ++]-->
</head>
<body>
    <my-component message="Hello, World!"></my-component> <!--[!code ++]-->
</body>
</html>
```
:::

Afterwards run `npm run dev` and visit your index.html.
