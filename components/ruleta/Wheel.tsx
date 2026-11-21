'use client';

import { useEffect, useRef, useState } from 'react';

export type WheelPrize = { id: string; label: string; color: string; weight: number };

/** Arco en grados de cada premio, proporcional a su peso (no a partes iguales). */
function getArcs(prizes: WheelPrize[]) {
  const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0) || 1;
  let acc = 0;

  return prizes.map((p) => {
    const start = (acc / totalWeight) * 360;
    acc += p.weight;
    const end = (acc / totalWeight) * 360;
    return { prize: p, start, end, center: (start + end) / 2 };
  });
}

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

    const arc = getArcs(prizes).find((a) => a.prize.id === targetPrizeId);
    if (!arc) return;

    const extraSpins = 6;

    setRotation((current) => current - (current % 360) + extraSpins * 360 + (360 - arc.center));

    timeoutRef.current = setTimeout(onSettled, 4700);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetPrizeId]);

  const arcs = getArcs(prizes);
  const gradient = arcs.map((a) => `${a.prize.color} ${a.start}deg ${a.end}deg`).join(', ');

  return (
    <div className="wheel-wrap">
      <div className="wheel-wrap__pointer" />
      <div className="wheel" style={{ background: `conic-gradient(${gradient})`, transform: `rotate(${rotation}deg)` }}>
        {arcs.map((a) => (
          <div key={a.prize.id} className="wheel__label" style={{ transform: `rotate(${a.center}deg)` }}>
            <span>{a.prize.label}</span>
          </div>
        ))}
      </div>
      <div className="wheel-wrap__hub" />
    </div>
  );
}
