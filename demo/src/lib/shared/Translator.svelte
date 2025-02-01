<!-- @custom-element translator-number -->
<script lang="ts">
    import {numberTranslator} from "./state.svelte";

    let {number = 0} = $props()
</script>

<div class="twp custom-element background-color flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md max-w-xs mx-auto text-sm">
    <span>Number is {number}</span>
    <span>Translation: {(numberTranslator.translate(number))}</span>
</div>