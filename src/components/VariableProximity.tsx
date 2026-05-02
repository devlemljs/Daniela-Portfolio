import React, { useRef, useState, useEffect, useMemo } from 'react';

interface VariableProximityProps {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: React.RefObject<HTMLElement>;
  radius?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function VariableProximity({
  label,
  fromFontVariationSettings,
  toFontVariationSettings,
  containerRef,
  radius = 100,
  falloff = 'linear',
  className = '',
  onClick,
  style,
}: VariableProximityProps) {
  const parsedFrom = useMemo(() => parseSettings(fromFontVariationSettings), [fromFontVariationSettings]);
  const parsedTo = useMemo(() => parseSettings(toFontVariationSettings), [toFontVariationSettings]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [containerRef]);

  return (
    <span className={className} onClick={onClick} style={{ ...style, display: 'inline-block' }}>
      {label.split('').map((char, i) => (
        <Letter
          key={i}
          char={char}
          mousePos={mousePos}
          containerRef={containerRef}
          parsedFrom={parsedFrom}
          parsedTo={parsedTo}
          radius={radius}
          falloff={falloff}
        />
      ))}
    </span>
  );
}

function Letter({ char, mousePos, containerRef, parsedFrom, parsedTo, radius, falloff }: any) {
  const ref = useRef<HTMLSpanElement>(null);
  const [settings, setSettings] = useState(parsedFrom);

  useEffect(() => {
    if (!ref.current || !containerRef.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const charX = rect.left - containerRect.left + rect.width / 2;
    const charY = rect.top - containerRect.top + rect.height / 2;

    const dist = Math.sqrt(Math.pow(mousePos.x - charX, 2) + Math.pow(mousePos.y - charY, 2));
    
    let proximity = 0;
    if (dist < radius) {
      if (falloff === 'linear') {
        proximity = 1 - dist / radius;
      } else if (falloff === 'exponential') {
        proximity = Math.exp(-dist / (radius / 3));
      } else if (falloff === 'gaussian') {
        proximity = Math.exp(-Math.pow(dist, 2) / (2 * Math.pow(radius / 3, 2)));
      }
    }

    const newSettings = Object.keys(parsedFrom).reduce((acc: any, key) => {
      acc[key] = parsedFrom[key] + (parsedTo[key] - parsedFrom[key]) * proximity;
      return acc;
    }, {});

    setSettings(newSettings);
  }, [mousePos, parsedFrom, parsedTo, radius, falloff, containerRef]);

  const style = {
    fontVariationSettings: Object.entries(settings)
      .map(([key, val]) => `'${key}' ${val}`)
      .join(', '),
    display: 'inline-block',
    whiteSpace: 'pre' as const,
  };

  return <span ref={ref} style={style}>{char}</span>;
}

function parseSettings(settings: string) {
  const parts = settings.split(',').map(s => s.trim());
  const obj: any = {};
  parts.forEach(p => {
    const match = p.match(/'(\w+)'\s+(\d+)/);
    if (match) {
      obj[match[1]] = parseInt(match[2]);
    }
  });
  return obj;
}
