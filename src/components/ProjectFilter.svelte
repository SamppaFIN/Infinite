<script>
  let { tags = [] } = $props();

  let activeTag = $state(null);

  function selectTag(tag) {
    activeTag = activeTag === tag ? null : tag;
    // Dispatch custom event for the gallery to handle
    window.dispatchEvent(new CustomEvent('project-filter', {
      detail: { tag: activeTag }
    }));
  }
</script>

<div class="flex flex-wrap justify-center gap-2 mb-10 reveal">
  <button
    class="tech-badge px-4 py-2 text-sm cursor-pointer {activeTag === null ? '!bg-[var(--color-accent)] !text-white !border-[var(--color-accent)]' : ''}"
    onclick={() => selectTag(null)}
  >
    All
  </button>
  {#each tags as tag}
    <button
      class="tech-badge px-4 py-2 text-sm cursor-pointer {activeTag === tag ? '!bg-[var(--color-accent)] !text-white !border-[var(--color-accent)]' : ''}"
      onclick={() => selectTag(tag)}
    >
      {tag}
    </button>
  {/each}
</div>
