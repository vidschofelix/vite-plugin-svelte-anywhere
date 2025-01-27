<svelte:options customElement={{ tag: '{{CUSTOM_ELEMENT_TAG}}', shadow: '{{SHADOW_MODE}}' }} />

<script>
    let { ...props } = $props();
    let Component = $state(null);
    $effect(async () => {
        try {
            Component = (await import('{{SVELTE_PATH}}')).default;
        } catch (e) {
            console.error(e);
        }
    });
</script>

<Component {...props} />