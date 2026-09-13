<!-- @custom-element x-translator -->
<script>
    import {numberTranslator} from "./state.svelte";
    let {number: number = 0} = $props();
</script>

{numberTranslator.translate(number)}