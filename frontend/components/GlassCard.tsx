import React, { useRef, useEffect, ReactNode } from 'react';
import styled from 'styled-components';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className }) => {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    const handlePointerMove = (event: PointerEvent) => {
      const { clientX, clientY } = event;
      const { left, top } = blob.parentElement!.getBoundingClientRect();
      blob.style.opacity = '1';
      blob.animate(
        {
          left: `${clientX - left}px`,
          top: `${clientY - top}px`,
        },
        { duration: 3000, fill: 'forwards' }
      );
    };

    const handlePointerLeave = () => {
        if(blob) {
            blob.style.opacity = '0';
        }
    }

    const parent = blob.parentElement;
    parent?.addEventListener('pointermove', handlePointerMove);
    parent?.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      parent?.removeEventListener('pointermove', handlePointerMove);
      parent?.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <StyledWrapper className={className}>
      <div className="card">
        <div className="bg">{children}</div>
        <div ref={blobRef} className="blob" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .blob {
    position: absolute;
    z-index: 0;
    left: 50%;
    top: 50%;
    width: 350px;
    height: 350px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    opacity: 0;
    filter: blur(80px);
    transition: opacity 0.5s ease-in-out;
  }

  .bg {
    position: relative;
    z-index: 1;
    height: 100%;
    width: 100%;
    background: rgba(10, 10, 12, 0.85);
    backdrop-filter: blur(32px);
    border-radius: 0;
    border: 1px solid rgba(255, 255, 255, 0.15);
    overflow: hidden;
    transition: background-color 0.3s ease, border-color 0.3s ease;
  }
`;

export default GlassCard;
