<script>
  import { onMount } from 'svelte';

  let { projects = [], locale = 'en' } = $props();

  let activeProject = $state(null);
  let visible = $state(false);

  function open(slug) {
    const project = projects.find(p => p.slug === slug);
    if (project) {
      activeProject = project;
      visible = true;
      document.body.style.overflow = 'hidden';
      // Update URL without reload
      const url = new URL(window.location);
      url.searchParams.set('project', slug);
      window.history.pushState({}, '', url);
    }
  }

  function close() {
    visible = false;
    document.body.style.overflow = '';
    const url = new URL(window.location);
    url.searchParams.delete('project');
    window.history.pushState({}, '', url);
    // Delay clearing so animation plays
    setTimeout(() => { activeProject = null; }, 300);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
  }

  // Listen for card clicks
  function onCardClick(e) {
    const card = e.target.closest('[data-project-slug]');
    if (card) {
      const slug = card.dataset.projectSlug;
      open(slug);
    }
  }

  // Open from URL param on load
  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('project');
    if (slug) open(slug);

    document.addEventListener('click', onCardClick);
    document.addEventListener('keydown', onKeydown);

    return () => {
      document.removeEventListener('click', onCardClick);
      document.removeEventListener('keydown', onKeydown);
    };
  });

  function title(project) {
    return project?.title?.[locale] || project?.title?.en || '';
  }
  function description(project) {
    return project?.description?.[locale] || project?.description?.en || '';
  }
  function learnings(project) {
    return project?.learnings?.[locale] || project?.learnings?.en || '';
  }
</script>

{#if visible && activeProject}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title(activeProject)}>
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick={close}></div>

    <!-- Modal -->
    <div class="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl animate-modal-in">
      <!-- Close button -->
      <button
        onclick={close}
        class="absolute top-4 right-4 z-10 p-2 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
        aria-label="Close"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <!-- Image -->
      <div class="relative h-64 md:h-80">
        <img
          src={activeProject.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop'}
          alt={title(activeProject)}
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent"></div>
      </div>

      <!-- Content -->
      <div class="p-8 md:p-10">
        <h2 class="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
          {title(activeProject)}
        </h2>

        <p class="mt-4 text-lg text-[var(--color-text-secondary)] leading-relaxed">
          {description(activeProject)}
        </p>

        <!-- Tech Stack -->
        <div class="mt-6">
          <h3 class="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
            {locale === 'fi' ? 'Teknologiat' : 'Tech Stack'}
          </h3>
          <div class="flex flex-wrap gap-2">
            {#each activeProject.tags as tag}
              <span class="tech-badge">{tag}</span>
            {/each}
          </div>
        </div>

        <!-- Learnings -->
        {#if learnings(activeProject)}
          <div class="mt-6">
            <h3 class="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
              {locale === 'fi' ? 'Mitä Opin' : 'What I Learned'}
            </h3>
            <p class="text-[var(--color-text-secondary)] leading-relaxed">
              {learnings(activeProject)}
            </p>
          </div>
        {/if}

        <!-- Links -->
        <div class="mt-8 flex flex-wrap gap-4">
          {#if activeProject.demoUrl}
            <a
              href={activeProject.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--color-accent)] text-white font-medium hover:bg-[var(--color-accent-glow)] transition-all duration-300"
            >
              {locale === 'fi' ? 'Live-demo' : 'Live Demo'} →
            </a>
          {/if}
          {#if activeProject.repoUrl}
            <a
              href={activeProject.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium hover:border-[var(--color-accent)] transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              {locale === 'fi' ? 'Repository' : 'View Repository'}
            </a>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes modalIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .animate-modal-in {
    animation: modalIn 0.25s ease-out;
  }
</style>
