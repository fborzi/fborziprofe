<script>
    import DropdownClose from "../icons/DropdownOpen.svelte";

    let isDropdownOpen = false;

    const handleClick = () => {
        isDropdownOpen = !isDropdownOpen;
    };

    const handleDropdownClose = () => {
        isDropdownOpen = false;
    };
</script>

<div class="flex items-center relative">
    <div class="dropdown relative" on:clickoutside={handleDropdownClose}>
        <button class="btn m-1" on:click={handleClick}>
            {#if isDropdownOpen}
                <DropdownClose />
                <ul
                    class="dropdown-content menu p-2 w-full flex flex-col items-center justify-center"
                    style:visibility={isDropdownOpen ? "visible" : "hidden"}
                >
                    <a
                        class="text-white hover:text-black px-3 py-1 rounded-full transition"
                        href="/#">Inicio</a
                    >
                    <a
                        class="text-white hover:scale-110 px-3 py-1 rounded-full transition drop-shadow-sm"
                        href="/estudiantes">Estudiantes</a
                    >
                    <a
                        class="text-white hover:scale-110 px-3 py-1 rounded-full transition drop-shadow-sm"
                        href="/login">Login</a
                    >
                    <a
                        class="text-white hover:text-black px-3 py-1 rounded-full transition"
                        href="https://wa.me/5491151541828"
                        target="_blank"
                        rel="noopener">WhatsApp</a
                    >
                </ul>
            {:else}
                <svg
                    class="icon icon-tabler icon-tabler-menu-2 drop-shadow-md text-white size-8 rounded hover:scale-110 hover:bg-black/90"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
                        d="M4 6l16 0"
                    /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg
                >
            {/if}
        </button>
    </div>
</div>
