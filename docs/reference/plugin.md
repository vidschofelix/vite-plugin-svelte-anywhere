# Plugin Config

| Option	            | Type       | 	Default                        | Description                                                               |
|--------------------|------------|---------------------------------|---------------------------------------------------------------------------|
| componentsDir      | 	`string`	 | `src`	                            | Directory where your Svelte components are located.                       |
| outputDir	         | `string`	  | `src/generated/custom-element`	 | Directory where the custom elements are generated.                        |
| defaultMode        | 	`string`  | 	`'lazy'`                       | 	The default template to use: `'lazy'` or `'eager'`                       |
| defaultShadowMode	 | `string`   | `'none'`	                       | ShadowDom Mode: `'open'` or 	`'none'`                                     |
| templatesDir       | `string`     | 	undefined                      | 	Path to a directory with custom templates for eager and lazy components. |
| cleanOutputDir     | `boolean`  | `true`                          | Whether to clean the `outputDir` on each build.                           |
| log                | `boolean`  | `false`                         | Whether to enable logging, for debugging purposes                         | 
