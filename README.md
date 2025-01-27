# Vite Plugin Svelte Everywhere
Easily use Svelte components outside a Svelte context! 
This Vite plugin empowers developers to define reusable custom elements directly within their Svelte components. 
Once set up, simply annotate your component with a custom tag, and it’s ready to be embedded anywhere HTML is accepted—no additional steps required.

## Why Use This Plugin?
- **Empower Legacy Projects**: Modernize without rewriting—embed Svelte components in legacy projects.
- **Custom Elements Made Easy**: Create and register custom HTML elements directly from Svelte components.
- **Effortless Embedding**: Works in Vanilla JavaScript, server-rendered HTML, CMS platforms—anywhere HTML is supported.
- **Dynamic Updates**: Hot module reloading during development automatically updates your custom elements.
- **Configurable Shadow DOM**: Full control over encapsulation with open, closed, or none shadow DOM modes.

## Downsides Of This Plugin
- No excuse to not use Svelte anymore :(

---

## Installation
Install the plugin as a development dependency:
```bash
npm install vite-plugin-svelte-everywhere --save-dev
```
---
## Usage
### 1. Configure the plugin in your `vite.config.js`
```js
import svelteEverywhere from 'vite-plugin-svelte-everywhere';

export default {
    plugins: [
        svelteEverywhere({
            componentsDir: 'src/components',      // Directory containing your Svelte components
            outputDir: 'src/generated/custom-elements',   // Directory where custom elements are generated
            defaultMode: 'lazy',                // Default loading behavior ('eager' or 'lazy')
            defaultShadowMode: 'none',           // Default shadow DOM mode ('open' or 'none')
        }),
        svelte({
            compilerOptions: {
                customElement: true,
            }
        }),
    ],
    //...
    build: {
        manifest: true, // generate manifest.json in outDir
        rollupOptions: {
            input: './src/main.ts' // overwrite default .html entry
        },
    },
};

```
**Notice**:  `svelteEverywhere()` must be positioned **ABOVE** your `svelte()` plugin

### 2. Load custom elements into `main.ts`
```ts
import.meta.glob('./generated/custom-component/*', {eager: true})
``` 

### 3. Annotate Your Svelte Components
   Use the @custom-element annotation to define custom tags in your Svelte components:
```sveltehtml
<!-- src/components/MyComponent.svelte -->
<!-- Creates a custom element <my-component> -->
<!-- @custom-element my-component -->
<script>
   let { message = 'Hello!' } = $props();
</script>

<div>{message}</div>
```

### 4. Embed Custom Elements Anywhere
```html
<!DOCTYPE html>
<html>
<head>
   <script type='module' src='http://localhost:5173/@vite/client'></script>
   <script type="module" src="http://localhost:5173/src/main.ts"></script>
</head>
<body>
    <my-component message="Hello, World!"></my-component>
</body>
</html>
```
Read more about how to load main.ts in [production](#production)

---
## Plugin Options

| Option	            | Type       | 	Default                          | Description                                                               |
|--------------------|------------|-----------------------------------|---------------------------------------------------------------------------|
| componentsDir      | 	`string`	 | src	                              | Directory where your Svelte components are located.                       |
| outputDir	         | `string`	  | `src/generated/custom-component`	 | Directory where the custom elements are generated.                        |
| defaultMode        | 	`string`  | 	`'lazy'`                         | 	The default template to use: `'lazy'` or `'eager'`                       |
| defaultShadowMode	 | `string`   | `'none'`	                         | ShadowDom Mode: `'open'` or 	`'none'`                                     |
| templatesDir       | `string`     | 	undefined                        | 	Path to a directory with custom templates for eager and lazy components. |
| cleanOutputDir     | `boolean`  | `true`                            | Whether to clean the `outputDir` on each build.                           |
| log                | `boolean`  | `false`                           | Whether to enable logging, for debugging purposes                         | 

## Features
- **Legacy Project Support**: Embed Svelte components into any HTML or JS environment.
- **Hot Module Reloading**: Automatically regenerate components during development.
- **Shared State**: Even if created in different places: Components that share external ressources like state, libraries or functions will use the same ressources.
- **Lazy Loading and Caching**: Svelte will by default chunk code into pieces with cacheable names. Only ressources that are really used will be loaded. 
- **Shadow DOM Control**: Choose between open, or no shadow DOM.
- **Custom Templates**: Override default templates for eager or lazy custom elements.


---

## Do i really need this as a plugin?
No. You can absolutely do this by hand. Just copy the template for every component you want to use as custom component, 
name it mycomponent.entry.svelte and add 
```js
import.meta.glob('./**/**.entry.svelte', { eager: true });
```
to your main.ts


## Diving deeper
### How this works
This plugin uses custom elements as entrypoint from the HTML DOM into a Svelte Environment. This is possible because 
Svelte itself proved the ability to write Svelte code in custom components. Those components usually come with some 
limitations. But... They are also able to load native Svelte Components. And thats all this plugin does. Creating 
custom components that load svelte components. By default the custom component load the svelte component while being 
mounted, using an $effect rune. Props get passed down into the svelte component. 

### Embedding into HTML
#### Development
Like in the example, all you need is to load the vite client and the main.ts. 
Vite will support development with Hot Module Replacement, even for custom elements.  

```html
<script type='module' src='http://localhost:5173/@vite/client'></script>
<script type="module" src="http://localhost:5173/src/main.ts"></script>
```

#### Production
Production is more tricky: Since building your project results in chunked files with hashes in their name you can either:
- force a static output name with a rollup option (not recommended)
- parse the manifest for your main.ts and load it (recommended)

For example in PHP it could look like this:
``` php
$manifest = file_get_contents(PROJECT_ROOT . '/public/dist/.vite/manifest.json');
$manifest = json_decode($manifest, true); //decode json string to php associative array
$svelteJs = $manifest['src/main.ts']['file'];
$svelteCssFiles = $manifest['src/main.ts']['css']; //there are multiple
echo "<script src='$svelteJs' type='module'></script>";
foreach ($svelteCssFiles as $file) {
   echo "<link rel='stylesheet' href='$file' type='text/css'>";
};
```

#### Combined Example
You can test weather your Vite is running to switch between the development and build bundle
 ``` php
$useVite = false;
if ($environment === 'development') {
   //test connection to  vite, no need to throw warning
   $fp = @fsockopen('tcp://localhost', 5173, $errno, $errstr, 1);
   if ($fp) {
      $useVite = true;
   }
}

if ($useVite) {
  echo
  <<<HTML
      <script src="http://localhost:5173/@vite/client" type="module"></script>
      <script src="http://localhost:5173/src/main.ts" type="module"></script>
  HTML;
} else {
   $manifest = file_get_contents(PROJECT_ROOT . '/public/dist/.vite/manifest.json');
   $manifest = json_decode($manifest, true); //decode json string to php associative array
   $svelteJs = $manifest['src/main.ts']['file'];
   $svelteCssFiles = $manifest['src/main.ts']['css']; //there are multiple
   echo "<script src='$svelteJs' type='module'></script>";
   foreach ($svelteCssFiles as $file) {
      echo "<link rel='stylesheet' href='$file' type='text/css'>";
   };
}
```