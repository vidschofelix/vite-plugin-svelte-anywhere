# Demos
:::info
All components of this page are svelte components, wrappend in custom elements (that's what the plugin does). 
The Page itself is a vue project.
:::

## Counter
No Svelte Demo without the Counter!
<x-counter/>
::: details source code
:::code-group
<<<  @/../demo/src/lib/Counter.svelte{svelte}
:::

## Pokemon Widget
<pokemon-widget/>

::: details source code
:::code-group
<<<  @/../demo/src/lib/PokemonWidget.svelte{svelte}
:::

## Number Translator
Multiple custom components sharing state
<number-switch/>
<translator-number number="1"/>
<translator-number number="4"/>
<translator-number number="9"/>

::: details source code
:::code-group
<<<  @/../demo/src/lib/shared/state.svelte.ts{ts}
<<<  @/../demo/src/lib/shared/Switch.svelte{svelte}
<<<  @/../demo/src/lib/shared/Translator.svelte{svelte}
:::

## Counter with Shadow-Mode Open
<shadow-counter/>
::: details source code
:::code-group
<<<  @/../demo/src/lib/ShadowCounter.svelte{svelte}
:::
