<!-- @custom-element language-switch -->
<script lang="ts">
    import {numberTranslator} from "./state.svelte";
    let checked: boolean = $derived(numberTranslator.getLanguage() == 'es')

    function toggleLanguage() {
        numberTranslator.toggleLanguage()
    }
</script>

<div class="twp w-48 rounded-lg">
    <div class="flex items-center mb-5 mx-5 py-1 ">
        <span class="mr-3 text-sm font-medium  ">English</span>
        <label class="relative flex items-center  cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer" {checked} onclick={toggleLanguage}>
            <div class="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0  rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700 "></div>
        </label>
        <span class="ml-3 text-sm font-medium  ">Spanish</span>
    </div>
</div>