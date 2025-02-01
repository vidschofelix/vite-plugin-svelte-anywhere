---
outline: [2, 4]
---
# Plugin Config

## Full Reference
::: code-group
```ts [vite.config.ts] 
export default defineConfig({
    plugins: [
        svelteAnywhere({
            componentsDir: 'src',
            outputDir: 'src/generated/custom-element',
            defaultTemplate: 'lazy',
            defaultShadowMode: 'none',
            templatesDir: null,
            cleanOutputDir: true,
            log: true,
        }),
        svelte(),
    ]
});
```
:::

> [!IMPORTANT]
> Make sure `svelteAnywhere` is positioned above the `svelte()`-plugin.

## Options
### componentsDir
- type: string
- default: `src`

Directory where your Svelte components are located

### outputDir
- type: string
- default: `src/generated/custom-element`

Directory where the custom elements are generated

### defaultTemplate
- type: string
- default: `'lazy'`

The default template to use. If no templatesDir is provided must be 'lazy' or 'eager'. 
This can be overridden in [template annotation](component.md#template)

### defaultShadowMode
- type: string
- default: `'none'`

ShadowDom Mode: 'open' or 'none'. Can be overridden in [shadow annotation](component.md#shadow) 

### templatesDir
- type: ?string
- default: `null`
- example: `'src/template'`

Path to directory with custom templates. You can provide a directory in your codebase with custom templates. 
Those must be named `identifier.template` and can be used in the [template annotation](component.md#template) with `template=identifier` and also be set as [defaultTemplate](#defaulttemplate)

Read more at the [Custom Template Guide](/guide/custom-templates.md)

### cleanOutputDir
- type: boolean
- default: `true`

Whether to clean the `outputDir` on each build

### log
- type: boolean
- default: `false`

Whether to enable logging, for debugging purposes
