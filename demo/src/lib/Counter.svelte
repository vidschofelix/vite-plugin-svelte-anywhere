<!-- @custom-element x-counter -->
<script lang="ts">
    let count: number = $state(0)
    const increment = () => {
        count += 1
    }
</script>
<div class="twp background-color flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md max-w-xs mx-auto">
    <button
      onclick={increment}
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-md align-middle m-auto">
        count is {count}
    </button>
</div>