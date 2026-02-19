<script lang="ts">
    import ExerciseCard from '../ui/ExerciseCard.svelte';
    import { tick } from 'svelte';

    let { exercise } = $props<{ exercise: any }>();

    let isRunning = $state(false);
    let numeros = $state<number[]>([]);
    let inputValue = $state('');
    let inputElement = $state<HTMLInputElement | null>(null);
    let terminalBodyElement = $state<HTMLDivElement | null>(null);
    
    // Historial de la terminal
    let terminalLines = $state([
        { text: 'Programa iniciado. Ingrese 20 números entre -10 y 10.', type: 'info' },
        { text: 'Presione "Iniciar Terminal" para comenzar...', type: 'info' }
    ]);

    let resultados = $state<{negativos: number, ceros: number, promPositivos: string} | null>(null);

    async function scrollToBottom() {
        await tick();
        if (terminalBodyElement) {
            terminalBodyElement.scrollTop = terminalBodyElement.scrollHeight;
        }
    }

    function addLine(text: string, type: 'info' | 'error' | 'success' | 'warning' | 'normal' = 'normal') {
        terminalLines.push({ text, type });
        scrollToBottom();
    }

    async function iniciar() {
        isRunning = true;
        numeros = [];
        resultados = null;
        terminalLines = [
            { text: 'Programa iniciado. Ingrese 20 números entre -10 y 10.', type: 'info' },
            { text: '────────────────────────────────────────────────', type: 'info' }
        ];
        
        addLine(`Ingrese el número 1 de 20:`, 'warning');
        await tick();
        inputElement?.focus();
    }

    function handleSubmit(e?: Event) {
        e?.preventDefault();
        if (!isRunning || !inputValue.trim()) return;

        const valStr = inputValue.trim();
        const num = parseInt(valStr);
        inputValue = ''; // Limpiar input

        addLine(`> ${valStr}`, 'normal');

        if (isNaN(num)) {
            addLine('❌ Error: Debe ingresar un número válido.', 'error');
            addLine(`Ingrese el número ${numeros.length + 1} de 20:`, 'warning');
            return;
        }

        if (num < -10 || num > 10) {
            addLine(`❌ Error: ${num} está fuera del rango [-10, 10].`, 'error');
            addLine(`Ingrese el número ${numeros.length + 1} de 20:`, 'warning');
            return;
        }

        numeros.push(num);
        addLine(`✓ Número ${num} guardado (${numeros.length}/20)`, 'success');

        if (numeros.length >= 20) {
            procesarResultados();
        } else {
            addLine('');
            addLine(`Ingrese el número ${numeros.length + 1} de 20:`, 'warning');
            inputElement?.focus();
        }
    }

    function procesarResultados() {
        isRunning = false;
        addLine('');
        addLine('════════════════════════════════════════════════', 'info');
        addLine('PROCESANDO DATOS...', 'info');
        
        setTimeout(() => {
            let sumaNegativos = 0;
            let cantCeros = 0;
            let sumaPositivos = 0;
            let cantPositivos = 0;

            numeros.forEach(n => {
                if (n < 0) sumaNegativos += n;
                else if (n === 0) cantCeros++;
                else { sumaPositivos += n; cantPositivos++; }
            });

            const promPos = cantPositivos > 0 ? (sumaPositivos / cantPositivos).toFixed(2) : '0.00';
            
            resultados = {
                negativos: sumaNegativos,
                ceros: cantCeros,
                promPositivos: promPos
            };

            addLine('📊 RESULTADOS:', 'info');
            addLine(`✓ Sumatoria de negativos: ${sumaNegativos}`, 'success');
            addLine(`✓ Cantidad de ceros: ${cantCeros}`, 'success');
            addLine(`✓ Promedio de positivos: ${promPos}`, 'success');
            addLine('════════════════════════════════════════════════', 'info');
            addLine('Programa finalizado.', 'info');
        }, 800);
    }
</script>

<ExerciseCard {exercise}>
    <div class="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-gray-800 font-mono text-sm">
        <!-- Header Terminal -->
        <div class="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-gray-800">
            <div class="flex gap-2">
                <div class="size-3 rounded-full bg-red-500"></div>
                <div class="size-3 rounded-full bg-yellow-500"></div>
                <div class="size-3 rounded-full bg-green-500"></div>
            </div>
            <span class="text-gray-400 text-xs">Terminal - Ejercicio 11</span>
        </div>

        <!-- Body Terminal -->
        <div bind:this={terminalBodyElement} class="p-4 h-64 overflow-y-auto space-y-1">
            {#each terminalLines as line}
                <div class="
                    {line.type === 'error' ? 'text-red-400' : ''}
                    {line.type === 'success' ? 'text-green-400' : ''}
                    {line.type === 'info' ? 'text-blue-400' : ''}
                    {line.type === 'warning' ? 'text-yellow-400' : ''}
                    {line.type === 'normal' ? 'text-gray-300' : ''}
                ">
                    {line.text}
                </div>
            {/each}
        </div>

        <!-- Input Terminal -->
        {#if isRunning}
            <form onsubmit={handleSubmit} class="flex items-center bg-[#252525] border-t border-gray-800 p-2 px-4">
                <span class="text-green-400 font-bold mr-2">❯</span>
                <input 
                    bind:this={inputElement}
                    bind:value={inputValue}
                    type="number" 
                    class="flex-1 bg-transparent text-gray-200 focus:outline-none" 
                    placeholder="Escribe un número y presiona Enter..."
                />
            </form>
        {/if}
    </div>

    <div class="mt-4 flex gap-3">
        {#if !isRunning && numeros.length === 0}
            <button onclick={iniciar} class="flex-1 p-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors">
                ▶ Iniciar Terminal
            </button>
        {:else if !isRunning && numeros.length === 20}
            <button onclick={iniciar} class="flex-1 p-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold hover:bg-red-500/30 transition-colors">
                ↻ Reiniciar
            </button>
        {/if}
    </div>

    <!-- Resultados en UI Normal (fuera de la terminal) -->
    {#if resultados}
        <div class="bg-green-500/10 p-5 rounded-xl mt-4 border border-green-500/30 animate-in fade-in slide-in-from-top-2">
            <h4 class="text-green-400 font-bold mb-4">📊 Resumen de Resultados:</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div class="bg-black/40 p-3 rounded-lg border border-white/5">
                    <p class="text-gray-400 text-xs mb-1">Sumatoria negativos</p>
                    <p class="text-xl text-white font-mono">{resultados.negativos}</p>
                </div>
                <div class="bg-black/40 p-3 rounded-lg border border-white/5">
                    <p class="text-gray-400 text-xs mb-1">Cantidad de ceros</p>
                    <p class="text-xl text-white font-mono">{resultados.ceros}</p>
                </div>
                <div class="bg-black/40 p-3 rounded-lg border border-white/5">
                    <p class="text-gray-400 text-xs mb-1">Promedio positivos</p>
                    <p class="text-xl text-white font-mono">{resultados.promPositivos}</p>
                </div>
            </div>
        </div>
    {/if}
</ExerciseCard>