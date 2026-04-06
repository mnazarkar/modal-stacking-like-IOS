import React, {
  useLayoutEffect,
  useRef,
  useState
} from 'react';

const useModalStack = () => {
  const modalRef = useRef<HTMLDivElement[]>([]);
  const modalMetaRef = useRef<{ originalHeight: number }[]>([]);

  const startY = useRef<number>(0);
  const dragging = useRef<boolean>(false);
  const latestY = useRef<number>(0);
  const rafId = useRef<number | null>(null);

  const [divHeight, setDivHeight] = useState<number>(0);

  // Register modal
  const registerModal = (el: HTMLDivElement | null, index: number) => {
    if (!el) return;

    modalRef.current[index] = el;

    if (!modalMetaRef.current[index]) {
      modalMetaRef.current[index] = {
        originalHeight: el.scrollHeight,
      };
    }
  };

  // Close handler
  const handleCloseFunc = (
    closeCB: () => void,
    fromTouchEnd = false
  ) => {
      if (modalRef.current.at(-2)) {
        modalRef.current.at(-2)!.style.transform =
          'translateY(0) scale(1)';
      }

      modalRef.current.at(-1)!.style.animation = `${
        fromTouchEnd ? 'slideDownFromMiddle' : 'slideDown'
      } 0.45s cubic-bezier(0.22,1,0.36,1) forwards`;

    setTimeout(() => {
      closeCB();
      modalRef.current.pop();
      modalMetaRef.current.pop();
    }, 300);
  };

  // Touch start
  const handleTouchStart = (e: React.TouchEvent) => {

    dragging.current = true;
    startY.current = e.touches[0].clientY;

    const top = modalRef.current.at(-1);
    if (top) top.style.transition = 'none';
  };

  // Touch move
  const handleTouchMove = (e: React.TouchEvent) => {
     e.preventDefault(); // ✅ CRITICAL FIX FOR MOBILE DEVICES

    if (!dragging.current) return;

    latestY.current = e.touches[0].clientY - startY.current;

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updateStyles);
    }
  };

  // Animation logic
  const updateStyles = () => {
    const currentY = latestY.current;
    const len = modalRef.current.length;

    if (currentY <= 0 || len === 0) {
      rafId.current = null;
      return;
    }

    const topIndex = len - 1;

    const topModal = modalRef.current[topIndex];
    topModal.style.transform = `translateY(${currentY}px)`;

    for (let i = topIndex - 1; i >= 0; i--) {
      const modal = modalRef.current[i];
      const depth = topIndex - i;

      const scaleBase = 1 - depth * 0.04;
      const translateBase = depth * 28;

      const newTranslate = Math.min(
        -translateBase + currentY / 4,
        -(depth - 1) * 28
      );
      const newScale = Math.min(
        scaleBase + currentY / 400,
        1 - (depth - 1) * 0.04
      );

      modal.style.transition = 'none';
      modal.style.transform = `translateY(${newTranslate}px) scale(${newScale})`;

      if (depth === 1) {
        const prevMeta = modalMetaRef.current[i];
        const topMeta = modalMetaRef.current[topIndex];

        if (prevMeta && topMeta) {
          const difference =
            topMeta.originalHeight - prevMeta.originalHeight;

          modal.style.height = `${Math.max(
            topMeta.originalHeight -
              difference * Math.min(currentY / 120, 1),
            prevMeta.originalHeight
          )}px`;
        }
      }
    }

    rafId.current = null;
  };

  // Touch end
  const handleTouchEnd = (onClose: () => void) => {

    dragging.current = false;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }

    const len = modalRef.current.length;
    const currentY = latestY.current;
    const topIndex = len - 1;

    for (let i = 0; i < len; i++) {
      modalRef.current[i].style.transition =
        'transform 0.35s cubic-bezier(0.22,1,0.36,1), height 0.35s cubic-bezier(0.22,1,0.36,1)';
    }

    if (currentY > 120) {
      handleCloseFunc(onClose, true);
    } else {
      for (let i = 0; i < len; i++) {
        const depth = topIndex - i;

        modalRef.current[i].style.transform =
          depth === 0
            ? 'translateY(0)'
            : `translateY(-${depth * 28}px) scale(${1 - depth * 0.04})`;

        if (i !== topIndex) {
          modalRef.current[i].style.height = `${
            modalMetaRef.current[topIndex]?.originalHeight
          }px`;
        }
      }
    }

    latestY.current = 0;
  };

  // Resize observer
  useLayoutEffect(() => {

    const top = modalRef.current.at(-1);
    if (!top) return;

    const observer = new ResizeObserver(() => {
      setDivHeight(top.offsetHeight);
    });

    observer.observe(top);
    setDivHeight(top.offsetHeight);

    modalMetaRef.current[modalRef.current.length - 1] = {
      originalHeight: top.offsetHeight,
    };

    return () => observer.disconnect();
  });

  const getElementStyle = (isTop: boolean, depth: number) => {

    return {
      height: !isTop && divHeight ? `${divHeight}px` : 'auto',
      transform: !isTop
        ? `translateY(-${depth * 28}px) scale(${1 - depth * 0.04})`
        : '',
      boxShadow:
        '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
      transition:
        'transform 0.45s cubic-bezier(0.22,1,0.36,1), height 0.45s cubic-bezier(0.22,1,0.36,1)',
      overflow: !isTop ? 'hidden' : undefined,
    } as React.CSSProperties;
  };

  return { registerModal, handleCloseFunc, handleTouchStart, handleTouchMove, handleTouchEnd, getElementStyle, modalRef };
};

export default useModalStack;