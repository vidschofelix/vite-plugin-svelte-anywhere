<!-- @custom-element shadow-counter shadow=open -->
<script lang="ts">
    let count: number = $state(0)
    const increment = () => {
        count += 1
    }
</script>
<div>
    <button
        onclick={increment}
    >
        count is {count}
    </button>
</div>