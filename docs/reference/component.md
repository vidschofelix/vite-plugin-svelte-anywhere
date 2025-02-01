
# Component Config

## Full Reference
```js
<!-- @custom-element my-component template="foo" shadow="none" -->
```

## Tag Name
- **required**
- should be lowercase
- **must** contain at least one hyphen (`-`)
- must not start with an Number
- [more](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#valid_custom_element_names) 

## Template
- optional
- `lazy` or `eager`
- default is set by [defaultTemplate](plugin.md#defaulttemplate)

## Shadow
- optional
- `open` or `none`
- default is set by [Plugin Config](plugin.md#defaultshadowmode)