/**
 * Scroll-based reveal animations using Intersection Observer.
 * Elements with class "reveal" fade and slide in when they enter the viewport.
 */
/**
 * @returns {() => void} cleanup function
 */
export function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after reveal for performance
          observer.unobserve(entry.target);
        }
      }
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  // Observe all .reveal elements
  const elements = document.querySelectorAll('.reveal');
  for (const el of elements) {
    observer.observe(el);
  }

  // Cleanup
  return () => {
    observer.disconnect();
  };
}
