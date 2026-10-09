'use client';
import { useEffect } from 'react';
export default function Reveal() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('js');
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
    document.querySelectorAll('[data-r]').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
