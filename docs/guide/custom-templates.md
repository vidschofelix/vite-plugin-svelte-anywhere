# Custom Templates

## Plugin provided templates
By default the plugin comes with two templates:

::: code-group
<<<  @/../src/templates/lazy.template{js}
<<<  @/../src/templates/eager.template{js}
:::

If you want to use your own template follow these steps:
## Create folder
For this example we will use `src/template`
## Define templatefolder in config
:::code-group
``` ts [vite.config.ts]
export default defineConfig({
    plugins: [
        svelteAnywhere({
            templatesDir: './src/template' // [!code ++]
        }),
    ]
});
```
:::

## Add your template
Copy one of the templates and adjust to your needs
:::code-group
``` js [src/template/dance.template] {6}
<svelte:options customElement={{ tag: '{{CUSTOM_ELEMENT_TAG}}', shadow: '{{SHADOW_MODE}}' }} />

<script>
    let { ...props } = $props();
    import Component from '{{SVELTE_PATH}}';
    console.log('Let's dance!);
</script>

<Component {...props} />
```
:::

## Use your template
:::code-group
``` svelte [/src/lib/MyComponent.svelte]
<!-- @custom-element my-component template="dance" --> // [!code ++]

```
:::
You can use any of templates, either your custom ones or still the provided ones.  