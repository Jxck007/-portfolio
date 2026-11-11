import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import './TargetCursor.css';

export interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
  cursorColor?: string;
  cursorColorOnTarget?: string;
}

const getContainingBlock = (element: HTMLElement | null): HTMLElement | null => {
  let node = element?.parentElement;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== 'none' ||
      style.perspective !== 'none' ||
      style.filter !== 'none' ||
      style.willChange.includes('transform') ||
      style.willChange.includes('perspective') ||
      style.willChange.includes('filter') ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

const getContainingBlockOffset = (block: HTMLElement | null) => {
  if (!block) return { x: 0, y: 0 };
  const rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
};

export const TargetCursor: React.FC<TargetCursorProps> = ({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
  cursorColor = '#ffffff',
  cursorColorOnTarget
}) => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cornersRef = useRef<NodeListOf<HTMLElement> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const containingBlockRef = useRef<HTMLElement | null>(null);

  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef<{ x: number; y: number }[] | null>(null);
  const tickerFnRef = useRef<(() => void) | null>(null);
  const activeStrengthRef = useRef({ current: 0 });

  // Pointer-capability detection (NOT viewport width): the custom cursor is
  // a desktop mouse-follower. Disable it on primary-touch devices (phones,
  // tablets) AND on hybrids that only expose a coarse pointer (e.g. touch
  // laptops without an active mouse). Devices with any fine pointer keep the
  // desktop behaviour. Re-evaluated on change so rotating a hybrid device or
  // attaching/detaching a mouse flips the cursor correctly.
  const detectCoarsePointer = () => {
    if (typeof window === 'undefined') return false;
    const primaryCoarse = window.matchMedia('(pointer: coarse)').matches;
    const hasFine = window.matchMedia('(any-pointer: fine)').matches;
    const hasCoarse = window.matchMedia('(any-pointer: coarse)').matches;
    return primaryCoarse || (hasCoarse && !hasFine);
  };

  const [isMobile, setIsMobile] = useState(detectCoarsePointer);

  useEffect(() => {
    const queries = ['(pointer: coarse)', '(any-pointer: fine)', '(any-pointer: coarse)'];
    const mqls = queries.map((q) => window.matchMedia(q));
    const handler = () => setIsMobile(detectCoarsePointer());
    mqls.forEach((mq) => mq.addEventListener('change', handler));
    return () => mqls.forEach((mq) => mq.removeEventListener('change', handler));
  }, []);

  const constants = useMemo(
    () => ({
      borderWidth: 3,
      cornerSize: 12
    }),
    []
  );

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    const { x: offsetX, y: offsetY } = getContainingBlockOffset(containingBlockRef.current);
    gsap.to(cursorRef.current, {
      x: x - offsetX,
      y: y - offsetY,
      duration: 0.1,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    // Respect prefers-reduced-motion: disable cursor animation entirely
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll('.target-cursor-corner');

    containingBlockRef.current = getContainingBlock(cursor);
    const getOffset = () => getContainingBlockOffset(containingBlockRef.current);

    let activeTarget: HTMLElement | null = null;
    let currentLeaveHandler: (() => void) | null = null;
    let resumeTimeout: any = null;

    const cleanupTarget = (target: HTMLElement) => {
      if (currentLeaveHandler) {
        target.removeEventListener('mouseleave', currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    const initialOffset = getOffset();
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - initialOffset.x,
      y: window.innerHeight / 2 - initialOffset.y
    });

    const createSpinTimeline = () => {
      if (spinTl.current) {
        spinTl.current.kill();
      }
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };

    createSpinTimeline();

    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) {
        return;
      }

      const strength = activeStrengthRef.current.current;
      if (strength === 0) return;

      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;

      const corners = Array.from(cornersRef.current) as HTMLElement[];
      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x') as number;
        const currentY = gsap.getProperty(corner, 'y') as number;

        const targetX = targetCornerPositionsRef.current![i].x - cursorX;
        const targetY = targetCornerPositionsRef.current![i].y - cursorY;

        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;

        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;

        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration: duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto'
        });
      });
    };

    tickerFnRef.current = tickerFn;

    const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;
      const { x: offsetX, y: offsetY } = getOffset();
      const mouseX = (gsap.getProperty(cursorRef.current, 'x') as number) + offsetX;
      const mouseY = (gsap.getProperty(cursorRef.current, 'y') as number) + offsetY;
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY) as HTMLElement | null;
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget || elementUnderMouse.closest(targetSelector) === activeTarget);
      if (!isStillOverTarget) {
        if (currentLeaveHandler) {
          currentLeaveHandler();
        }
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    /* ACTIVE / PRESSED — contextual: pressed on an interactive target tightens
       the brackets around it; pressed off-target keeps the subtle squeeze. */
    const mouseDownHandler = () => {
      if (!cursorRef.current) return;
      if (activeTarget) {
        gsap.to(cursorRef.current, { scale: 0.94, duration: 0.12, ease: 'power2.out', overwrite: 'auto' });
        if (cornersRef.current) {
          gsap.to(cornersRef.current, { scale: 0.9, duration: 0.12, ease: 'power2.out', overwrite: 'auto' });
        }
      } else {
        if (dotRef.current) gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
        gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
      }
    };

    const mouseUpHandler = () => {
      if (!cursorRef.current) return;
      if (activeTarget) {
        gsap.to(cursorRef.current, { scale: 1, duration: 0.15, ease: 'power2.out', overwrite: 'auto' });
        if (cornersRef.current) {
          gsap.to(cornersRef.current, { scale: 1, duration: 0.15, ease: 'power2.out', overwrite: 'auto' });
        }
      } else {
        if (dotRef.current) gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
        gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
      }
    };

    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    /* ── DEFAULT → INTERACTIVE (shared by mouse hover + keyboard focus) ── */
    const acquireTarget = (target: HTMLElement) => {
      if (!cursorRef.current || !cornersRef.current) return;
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      const corners = Array.from(cornersRef.current) as HTMLElement[];
      corners.forEach(corner => gsap.killTweensOf(corner, 'x,y,scale'));
      gsap.set(corners, { scale: 1 }); // normalise any pressed scale

      gsap.killTweensOf(cursorRef.current, 'rotation,scale');
      spinTl.current?.pause();
      gsap.set(cursorRef.current, { rotation: 0 });
      cursorRef.current.classList.add('target-active');

      // Subtle lock-on scale bump — feels like target acquisition
      gsap.fromTo(
        cursorRef.current,
        { scale: 1 },
        { scale: 1.12, duration: 0.12, ease: 'power2.out', yoyo: true, repeat: 1, overwrite: 'auto' }
      );

      if (cursorColorOnTarget) {
        gsap.to(corners, {
          borderColor: cursorColorOnTarget,
          duration: 0.15,
          ease: 'power2.out'
        });
        if (dotRef.current) {
          gsap.to(dotRef.current, {
            backgroundColor: cursorColorOnTarget,
            duration: 0.15,
            ease: 'power2.out'
          });
        }
      }

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      const { x: offsetX, y: offsetY } = getOffset();
      const cursorX = gsap.getProperty(cursorRef.current, 'x') as number;
      const cursorY = gsap.getProperty(cursorRef.current, 'y') as number;

      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.top - borderWidth - offsetY },
        { x: rect.right + borderWidth - cornerSize - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY },
        { x: rect.left - borderWidth - offsetX, y: rect.bottom + borderWidth - cornerSize - offsetY }
      ];

      isActiveRef.current = true;
      if (tickerFnRef.current) {
        gsap.ticker.add(tickerFnRef.current);
      }

      gsap.to(activeStrengthRef.current, {
        current: 1,
        duration: hoverDuration,
        ease: 'power2.out'
      });

      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: targetCornerPositionsRef.current![i].x - cursorX,
          y: targetCornerPositionsRef.current![i].y - cursorY,
          duration: 0.2,
          ease: 'power2.out'
        });
      });
    };

    /* ── INTERACTIVE → DEFAULT (shared by mouse leave + focus out) ── */
    const releaseTarget = () => {
      if (!activeTarget) return;

      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
      }
      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      gsap.set(activeStrengthRef.current, { current: 0 });
      if (cursorRef.current) cursorRef.current.classList.remove('target-active');

      // Restore scale after leaving target (also unwinds any pressed state)
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { scale: 1, duration: 0.15, ease: 'power2.out', overwrite: 'auto' });
      }
      if (cornersRef.current) {
        gsap.to(cornersRef.current, { scale: 1, duration: 0.15, ease: 'power2.out', overwrite: 'auto' });
      }

      if (cursorColorOnTarget && cornersRef.current) {
        const cArr = Array.from(cornersRef.current) as HTMLElement[];
        gsap.to(cArr, {
          borderColor: cursorColor,
          duration: 0.15,
          ease: 'power2.out'
        });
        if (dotRef.current) {
          gsap.to(dotRef.current, {
            backgroundColor: cursorColor,
            duration: 0.15,
            ease: 'power2.out'
          });
        }
      }

      if (cornersRef.current) {
        const corners = Array.from(cornersRef.current) as HTMLElement[];
        gsap.killTweensOf(corners, 'x,y,scale');
        const { cornerSize } = constants;
        const positions = [
          { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
          { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
          { x: cornerSize * 0.5, y: cornerSize * 0.5 },
          { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
        ];
        const tl = gsap.timeline();
        corners.forEach((corner, index) => {
          tl.to(
            corner,
            {
              x: positions[index].x,
              y: positions[index].y,
              scale: 1, // also unwind any pressed contraction
              duration: 0.3,
              ease: 'power3.out'
            },
            0
          );
        });
      }

      resumeTimeout = setTimeout(() => {
        if (!activeTarget && cursorRef.current && spinTl.current) {
          const currentRotation = gsap.getProperty(cursorRef.current, 'rotation') as number;
          const normalizedRotation = currentRotation % 360;
          spinTl.current.kill();
          spinTl.current = gsap
            .timeline({ repeat: -1 })
            .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
          gsap.to(cursorRef.current, {
            rotation: normalizedRotation + 360,
            duration: spinDuration * (1 - normalizedRotation / 360),
            ease: 'none',
            onComplete: () => {
              spinTl.current?.restart();
            }
          });
        }
        resumeTimeout = null;
      }, 50);

      activeTarget = null;
    };

    /* Mouse hover — ONE delegated listener on window, no per-element binding */
    const enterHandler = (e: MouseEvent) => {
      const directTarget = e.target as HTMLElement | null;
      const allTargets: HTMLElement[] = [];
      let current = directTarget;
      while (current && current !== document.body) {
        if (current.matches(targetSelector)) {
          allTargets.push(current);
        }
        current = current.parentElement;
      }
      const target = allTargets[0] || null;
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;

      if (activeTarget) {
        cleanupTarget(activeTarget);
        releaseTarget();
      }
      acquireTarget(target);

      const leaveHandler = () => {
        releaseTarget();
        cleanupTarget(target);
      };
      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };

    window.addEventListener('mouseover', enterHandler, { passive: true });

    /* Keyboard focus — the same INTERACTIVE state via delegation (capture
       phase so it sees focus land on any .cursor-target, incl. menu controls) */
    const focusInHandler = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || !cursorRef.current || !cornersRef.current) return;
      const target = el.closest(targetSelector) as HTMLElement | null;
      if (!target) return;
      if (activeTarget === target) return;

      if (activeTarget) {
        cleanupTarget(activeTarget);
        releaseTarget();
      }
      acquireTarget(target);
    };

    const focusOutHandler = (e: FocusEvent) => {
      // If focus moved to another interactive target, focusin re-acquires it.
      const related = e.relatedTarget as HTMLElement | null;
      if (related && related.closest && related.closest(targetSelector)) return;
      if (activeTarget) {
        cleanupTarget(activeTarget);
        releaseTarget();
      }
    };

    window.addEventListener('focusin', focusInHandler, true);
    window.addEventListener('focusout', focusOutHandler, true);

    const resizeHandler = () => {
      containingBlockRef.current = getContainingBlock(cursor);
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
      }
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseover', enterHandler);
      window.removeEventListener('focusin', focusInHandler, true);
      window.removeEventListener('focusout', focusOutHandler, true);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);

      if (activeTarget) {
        cleanupTarget(activeTarget);
      }

      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;

      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      activeStrengthRef.current = { current: 0 };
    };
  }, [
    targetSelector,
    spinDuration,
    moveCursor,
    constants,
    hideDefaultCursor,
    isMobile,
    hoverDuration,
    parallaxOn,
    cursorColor,
    cursorColorOnTarget
  ]);

  useEffect(() => {
    if (isMobile || !cursorRef.current || !spinTl.current) return;
    if (spinTl.current.isActive()) {
      spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursorRef.current, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    }
  }, [spinDuration, isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <div ref={dotRef} className="target-cursor-dot" style={{ backgroundColor: cursorColor }} />
      <div className="target-cursor-corner corner-tl" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-tr" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-br" style={{ borderColor: cursorColor }} />
      <div className="target-cursor-corner corner-bl" style={{ borderColor: cursorColor }} />
    </div>
  );
};

export default TargetCursor;
