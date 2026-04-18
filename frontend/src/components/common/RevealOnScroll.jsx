import { useEffect, useRef } from 'react';

// IntersectionObserver-based reveal: attach `data-reveal` to any element,
// and on first visibility we flip it to "visible" so the CSS transition
// (`[data-reveal]` in index.css) kicks in. Uses a single observer shared
// across every mounted instance so a page full of reveals stays cheap.
let sharedObserver;
const getObserver = () => {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-reveal', 'visible');
          sharedObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  return sharedObserver;
};

export default function RevealOnScroll({ delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // Respect reduced-motion — just reveal straight away.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      el.setAttribute('data-reveal', 'visible');
      return undefined;
    }
    if (delay) el.style.transitionDelay = `${delay}ms`;
    const obs = getObserver();
    obs.observe(el);
    return () => obs.unobserve(el);
  }, [delay]);

  return (
    <div ref={ref} data-reveal="hidden" className={className} {...rest}>
      {children}
    </div>
  );
}
