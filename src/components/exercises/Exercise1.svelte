<script lang="ts">
    import ExerciseCard from '../ui/ExerciseCard.svelte';

    let { exercise } = $props<{ exercise: any }>();

    let num1 = $state<number | undefined>();
    let num2 = $state<number | undefined>();
    let error = $state<string | null>(null);
    let results = $state<Record<string, number | string> | null>(null);

    function calcular() {
        error = null;
        results = null;

        if (num1 === undefined || num2 === undefined) {
            error = 'Por favor ingrese ambos números';
            return;
        }
        if (num2 === 0) {
            error = 'No se puede dividir por cero';
            return;
        }

        results = {
            'Suma': num1 + num2,
            'Resta': num1 - num2,
            'Multiplicación': num1 * num2,
            'División (cociente)': (num1 / num2).toFixed(2),
            'Resto de la división': num1 % num2,
            'División entera': Math.floor(num1 / num2),
            [`Valor absoluto de ${num1}`]: Math.abs(num1),
            [`Valor absoluto de ${num2}`]: Math.abs(num2),
        };
    }
</script>

<ExerciseCard {exercise}>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label class="block text-gray-300 font-medium mb-2 text-sm" for="num1">Primer número entero:</label>
            <input id="num1" type="number" bind:value={num1} class="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/50 transition-colors" placeholder="Ej: 15">
        </div>
        <div>
            <label class="block text-gray-300 font-medium mb-2 text-sm" for="num2">Segundo número entero:</label>
            <input id="num2" type="number" bind:value={num2} class="w-full p-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/50 transition-colors" placeholder="Ej: 4">
        </div>
    </div>

    <button onclick={calcular} class="w-full mt-2 p-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]">
        Calcular
    </button>

    {#if error}
        <div class="bg-red-500/20 border-l-4 border-red-500 text-red-200 p-4 rounded-xl mt-4">
            ⚠️ {error}
        </div>
    {/if}

    {#if results}
        <div class="bg-green-500/10 p-5 rounded-xl mt-4 border border-green-500/30">
            <h4 class="text-green-400 font-bold mb-4 flex items-center gap-2">
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Resultados:
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {#each Object.entries(results) as [key, value]}
                    <div class="bg-black/40 p-3 rounded-lg text-gray-200 font-mono text-sm border border-white/5 flex justify-between">
                        <span class="text-gray-400">{key}:</span>
                        <span class="font-bold text-white">{value}</span>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</ExerciseCard>