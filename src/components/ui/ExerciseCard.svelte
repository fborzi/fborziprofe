<script lang="ts">
    import { slide } from 'svelte/transition';

    interface Props {
        exercise: {
            id: number;
            title: string;
            description: string;
        };
        children?: import('svelte').Snippet;
    }

    let { exercise, children }: Props = $props();
    let isOpen = $state(false);

    function toggle() {
        isOpen = !isOpen;
    }
</script>

<div class="bg-white/5 border border-white/10 rounded-2xl p-6 mb-5 backdrop-blur-sm shadow-xl transition-all duration-300 hover:bg-white/10">
    <!-- Header (Clickable) -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer" onclick={toggle}>
        <div class="flex items-center gap-4">
            <span class="bg-white text-black px-4 py-1.5 rounded-full font-bold text-sm shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                Ejercicio {exercise.id}
            </span>
            <h3 class="text-white font-semibold text-lg md:text-xl">{exercise.title}</h3>
        </div>
        <button class="bg-black/40 hover:bg-black/60 border border-white/10 text-white font-medium px-4 py-2 rounded-lg transition-colors w-full sm:w-auto">
            {isOpen ? 'Ocultar ▲' : 'Mostrar ▼'}
        </button>
    </div>

    <!-- Content -->
    {#if isOpen}
        <div transition:slide={{ duration: 300 }}>
            <div class="mt-6">
                <!-- Enunciado -->
                <div class="bg-black/30 p-5 rounded-xl mb-6 border-l-4 border-white/50 text-gray-300 leading-relaxed font-medium">
                    {exercise.description}
                </div>
                
                <!-- Área interactiva inyectada por el hijo -->
                <div class="space-y-4">
                    {@render children?.()}
                </div>
            </div>
        </div>
    {/if}
</div>