<script>
  import { getLocale, setLocale } from '../i18n/utils';

  let locale = $state('en');

  if (typeof window !== 'undefined') {
    locale = getLocale();
  }

  function toggleLang() {
    const next = locale === 'en' ? 'fi' : 'en';
    setLocale(next);
    locale = next;
    // Reload to re-render with new translations
    window.location.reload();
  }
</script>

<button
  onclick={toggleLang}
  class="px-3 py-1.5 rounded-full text-sm font-mono font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-accent-glow)] hover:bg-[var(--color-surface-hover)] transition-all duration-200"
  aria-label="Toggle language"
>
  {locale === 'en' ? 'FI' : 'EN'}
</button>
