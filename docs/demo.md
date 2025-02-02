# Demos
:::info
All components of this page are svelte components, wrappend in custom elements (that's what the plugin does). 
The Page itself is a vue project. To get a better idea, have a look at the source codes provided and inspect the source code of this page.
:::

## Counter
No Svelte Demo without the Counter! 

Embedded via `<x-counter/>`
<x-counter/>
::: details source code
:::code-group
<<<  @/../demo/src/lib/Counter.svelte{svelte}
:::

## Pokemon Widget
Embedded via `<pokemon-widget/>`
<pokemon-widget/>

::: details source code
:::code-group
<<<  @/../demo/src/lib/PokemonWidget.svelte{svelte}
:::

## Number Translator
Multiple custom components sharing state. 

Embedded via `<language-switch/>` and `<translator-container number="x"/>` 
<language-switch/>
<translator-container number="1"/>
<translator-container number="4"/>
<translator-container number="9"/>

::: details source code
:::code-group
<<<  @/../demo/src/lib/shared/state.svelte.ts{ts}
<<<  @/../demo/src/lib/shared/Switch.svelte{svelte}
<<<  @/../demo/src/lib/shared/Container.svelte{svelte}
<<<  @/../demo/src/lib/shared/Translator.svelte{svelte}
:::
---
Using the same Components, you can also let Svelte components output just text. 
In this case, the listing is part of the Vue-Page, the words are Svelte. 


Embedded via `<x-translator number="x"/>` and `<language-switch/>`

Lets count to 5:
- <x-translator number="1"/>
- <x-translator number="2"/>
- <x-translator number="3"/>
- <x-translator number="4"/>
- <x-translator number="5"/>

Now change the language: <language-switch/>





## Counter with Shadow-Mode Open
Embedded via `<shadow-counter/>`
<shadow-counter/>
::: details source code
:::code-group
<<<  @/../demo/src/lib/ShadowCounter.svelte{svelte}
:::
