import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Users, AlertTriangle, CheckCircle } from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  capacity: number;
  currentCount: number;
}

interface CrowdHeatmapProps {
  interactive?: boolean;
  onZoneClick?: (zone: Zone) => void;
}

export function CrowdHeatmap({ interactive = false, onZoneClick }: CrowdHeatmapProps) {
  const [zones, setZones] = useState<Zone[]>([
    { id: 'z1', name: 'Main Entrance', x: 10, y: 10, width: 80, height: 60, capacity: 200, currentCount: 165 },
    { id: 'z2', name: 'Temple Hall', x: 100, y: 20, width: 100, height: 80, capacity: 300, currentCount: 245 },
    { id: 'z3', name: 'Sanctum', x: 210, y: 40, width: 70, height: 70, capacity: 150, currentCount: 142 },
    { id: 'z4', name: 'Prayer Area', x: 290, y: 30, width: 90, height: 75, capacity: 250, currentCount: 98 },
    { id: 'z5', name: 'Exit Gate', x: 390, y: 15, width: 70, height: 55, capacity: 180, currentCount: 67 },
    { id: 'z6', name: 'Queue Zone', x: 50, y: 120, width: 85, height: 60, capacity: 200, currentCount: 188 },
    { id: 'z7', name: 'Prasad Counter', x: 160, y: 140, width: 75, height: 50, capacity: 100, currentCount: 42 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prev => prev.map(zone => ({
        ...zone,
        currentCount: Math.max(10, Math.min(zone.capacity, zone.currentCount + Math.floor(Math.random() * 21) - 10))
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getCrowdLevel = (zone: Zone) => {
    const percentage = (zone.currentCount / zone.capacity) * 100;
    if (percentage >= 90) return { color: '#ef4444', label: 'Critical', icon: AlertTriangle };
    if (percentage >= 70) return { color: '#f59e0b', label: 'High', icon: Users };
    if (percentage >= 40) return { color: '#3b82f6', label: 'Moderate', icon: Users };
    return { color: '#10b981', label: 'Low', icon: CheckCircle };
  };

  return (
    <div className="relative w-full aspect-[2/1] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Temple Layout */}
      <svg viewBox="0 0 500 220" className="w-full h-full">
        {zones.map((zone) => {
          const crowdLevel = getCrowdLevel(zone);
          const percentage = (zone.currentCount / zone.capacity) * 100;
          
          return (
            <g key={zone.id}>
              <motion.rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                rx="8"
                fill={crowdLevel.color}
                opacity="0.3"
                stroke={crowdLevel.color}
                strokeWidth="2"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className={interactive ? 'cursor-pointer' : ''}
                onClick={() => interactive && onZoneClick?.(zone)}
              />
              
              {/* Pulsing effect for critical zones */}
              {percentage >= 90 && (
                <motion.rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  rx="8"
                  fill="none"
                  stroke={crowdLevel.color}
                  strokeWidth="3"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 0, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
              )}
              
              <text
                x={zone.x + zone.width / 2}
                y={zone.y + zone.height / 2 - 10}
                textAnchor="middle"
                fill="white"
                className="text-xs font-semibold"
              >
                {zone.name}
              </text>
              <text
                x={zone.x + zone.width / 2}
                y={zone.y + zone.height / 2 + 8}
                textAnchor="middle"
                fill="white"
                className="text-xs"
              >
                {zone.currentCount}/{zone.capacity}
              </text>
              <text
                x={zone.x + zone.width / 2}
                y={zone.y + zone.height / 2 + 22}
                textAnchor="middle"
                fill={crowdLevel.color}
                className="text-xs font-bold"
              >
                {percentage.toFixed(0)}%
              </text>
            </g>
          );
        })}
        
        {/* Entry/Exit arrows */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
          </marker>
        </defs>
        
        {/* Entry flow */}
        <motion.path
          d="M 5 40 L 10 40"
          stroke="#10b981"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrowhead)"
          animate={{ pathLength: [0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        
        {/* Exit flow */}
        <motion.path
          d="M 460 42 L 470 42"
          stroke="#3b82f6"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrowhead)"
          animate={{ pathLength: [0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-slate-900/90 p-3 rounded-lg border border-slate-700 backdrop-blur-sm">
        <div className="text-xs text-white font-semibold mb-2">Crowd Density</div>
        <div className="flex flex-col gap-1.5">
          {[
            { color: '#10b981', label: 'Low (0-40%)', icon: CheckCircle },
            { color: '#3b82f6', label: 'Moderate (40-70%)', icon: Users },
            { color: '#f59e0b', label: 'High (70-90%)', icon: Users },
            { color: '#ef4444', label: 'Critical (90%+)', icon: AlertTriangle }
          ].map(({ color, label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="w-3 h-3" style={{ color }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-slate-300">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
