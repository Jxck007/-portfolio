import React, { useEffect, useRef } from 'react';
import './ScrambledText.css';

export interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: React.CSSProperties;
  autoReveal?: boolean;
  children: React.ReactNode;
}

export const ScrambledText: React.FC<ScrambledTextProps> = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
  autoReveal = true,
  children
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const charsRef = useRef<HTMLElement[]>([]);
  const animatingMap = useRef<Map<HTMLElement, number>>(new Map());

  // Extract raw text from children
  const rawText = typeof children === 'string' 
    ? children 
    : Array.isArray(children) 
      ? children.join('') 
      : String(children || '');

  useEffect(() => {
    if (!rootRef.current) return;
    const p = rootRef.current.querySelector('p');
    if (!p) return;

    // Split text into span characters
    const text = rawText || p.textContent || '';
    p.innerHTML = '';
    const chars: HTMLElement[] = [];

    const words = text.split(/(\s+)/);
    words.forEach((chunk) => {
      if (/^\s+$/.test(chunk)) {
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'char whitespace-char';
        spaceSpan.innerHTML = chunk === ' ' ? '&nbsp;' : chunk;
        spaceSpan.setAttribute('data-char', chunk);
        p.appendChild(spaceSpan);
        chars.push(spaceSpan);
      } else {
        const wordContainer = document.createElement('span');
        wordContainer.className = 'inline-block whitespace-nowrap';
        for (let i = 0; i < chunk.length; i++) {
          const char = chunk[i];
          const span = document.createElement('span');
          span.className = 'char';
          span.textContent = char;
          span.setAttribute('data-char', char);
          wordContainer.appendChild(span);
          chars.push(span);
        }
        p.appendChild(wordContainer);
      }
    });

    charsRef.current = chars;

    // Scramble helper function for an individual character
    const scrambleChar = (el: HTMLElement, intensity: number) => {
      const original = el.getAttribute('data-char');
      if (!original || /^\s+$/.test(original)) return;

      const effectDuration = (duration * (0.4 + 0.6 * intensity)) * 1000;
      const startTime = performance.now();
      const charsList = scrambleChars || '.:';

      if (animatingMap.current.has(el)) {
        cancelAnimationFrame(animatingMap.current.get(el)!);
      }

      const frameInterval = Math.max(25, 60 * (1 - speed * 0.5));
      let lastUpdate = 0;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / effectDuration);

        if (progress < 1) {
          if (now - lastUpdate > frameInterval) {
            const randomChar = charsList[Math.floor(Math.random() * charsList.length)];
            el.textContent = randomChar;
            lastUpdate = now;
          }
          const id = requestAnimationFrame(step);
          animatingMap.current.set(el, id);
        } else {
          el.textContent = original;
          animatingMap.current.delete(el);
        }
      };

      const id = requestAnimationFrame(step);
      animatingMap.current.set(el, id);
    };

    // Auto-reveal cascade on mount
    if (autoReveal && chars.length > 0) {
      chars.forEach((c, idx) => {
        const char = c.getAttribute('data-char');
        if (!char || /^\s+$/.test(char)) return;
        const delay = (idx / chars.length) * 1200 + 100;
        setTimeout(() => {
          scrambleChar(c, 0.8);
        }, delay);
      });
    }

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      charsRef.current.forEach((c) => {
        const char = c.getAttribute('data-char');
        if (!char || /^\s+$/.test(char)) return;

        const rect = c.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = clientX - centerX;
        const dy = clientY - centerY;
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          const intensity = 1 - dist / radius;
          scrambleChar(c, intensity);
        }
      });
    };

    const rootEl = rootRef.current;
    rootEl.addEventListener('pointermove', handlePointerMove as any);

    return () => {
      rootEl.removeEventListener('pointermove', handlePointerMove as any);
      animatingMap.current.forEach((id) => cancelAnimationFrame(id));
      animatingMap.current.clear();
    };
  }, [radius, duration, speed, scrambleChars, autoReveal, rawText]);

  return (
    <div ref={rootRef} className={`text-block ${className}`} style={style}>
      <p>{rawText}</p>
    </div>
  );
};

export default ScrambledText;
