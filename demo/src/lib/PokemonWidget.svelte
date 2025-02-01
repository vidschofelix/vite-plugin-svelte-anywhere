<!-- @custom-element pokemon-widget -->
<script lang="ts">
    import {blur} from 'svelte/transition';

    type Pokemon = {
        name: string;
        sprites: { front_default: string };
    };

    let pokemon = $state<Pokemon | null>(null);
    let disableButton = $state(false)
    fetchPokemon();

    async function fetchPokemon() {
        disableButton = true
        const id = Math.floor(Math.random() * 898) + 1; // Random Pokémon ID
        pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((res) => {
                disableButton = false
                return res.json()
            });
    }
</script>

<div class="twp flex flex-col items-center p-6 rounded-lg shadow-md max-w-xs mx-auto">
    <div class="w-20 h-20 object-contain shadow-md rounded-lg">
        {#key pokemon?.name}
            <img transition:blur
                 src={pokemon?.sprites.front_default}
                 alt={pokemon?.name}
                 class={["w-20 h-20 object-contain absolute"]}/>
        {/key}
    </div>

    <div class="w-60 h-10 ">
        {#key pokemon?.name}
            <p class={['text-xl font-semibold capitalize w-60 h-10 text-center absolute']}
               transition:blur>{pokemon?.name ?? "Loading"}</p>
        {/key}
    </div>

    <button onclick={fetchPokemon} disabled={disableButton}
            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-60"
    >
        Get Random Pokémon
    </button>
</div>