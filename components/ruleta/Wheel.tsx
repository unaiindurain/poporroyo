'use client';

import { useEffect, useRef, useState } from 'react';

export type WheelPrize = { id: string; label: string; color: string };

export default function Wheel({
  prizes,
  targetPrizeId,
  onSettled,
}: {
  prizes: WheelPrize[];
  targetPrizeId: string | null;
  onSettled: () => void;
}) {
  const [rotation, setRotation] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!targetPrizeId) return;

    const index = prizes.findIndex((p) => p.id === targetPrizeId);
    if (index === -1) return;

    const segment = 360 / prizes.length;
    const segmentCenter = index * segment + segment / 2;
    const extraSpins = 6;

    setRotation((current) => current - (current % 360) + extraSpins * 360 + (360 - segmentCenter));

    timeoutRef.current = setTimeout(onSettled, 4700);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPrizeId]);

  const segment = 360 / Math.max(prizes.length, 1);
  const gradient = prizes.map((p, i) => `${p.color} ${i * segment}deg ${(i + 1) * segment}deg`).join(', ');

  return (
    <div className="wheel-wrap">
      <div className="wheel-wrap__pointer" />
      <div className="wheel" style={{ background: `conic-gradient(${gradient})`, transform: `rotate(${rotation}deg)` }}>
        {prizes.map((p, i) => (
          <div key={p.id} className="wheel__label" style={{ transform: `rotate(${i * segment + segment / 2}deg)` }}>
            <span>{p.label}</span>
          </div>
        ))}
      </div>
      <div className="wheel-wrap__hub" />
    </div>
  );
}
