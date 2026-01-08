/**
 * HOS Clock Component
 * Visual Hours of Service clock showing remaining time
 */

import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface HOSClockProps {
  hoursRemaining: number;
  maxHours: number;
  label: string;
  warningThreshold?: number;
  size?: 'sm' | 'md' | 'lg';
}

const HOSClock: React.FC<HOSClockProps> = ({
  hoursRemaining,
  maxHours,
  label,
  warningThreshold = 2,
  size = 'md',
}) => {
  const percentage = (hoursRemaining / maxHours) * 100;
  const isWarning = hoursRemaining <= warningThreshold;
  const isCritical = hoursRemaining <= 0;

  const sizes = {
    sm: { container: 'w-24 h-24', svg: 24, radius: 35, stroke: 6, text: 'text-lg' },
    md: { container: 'w-32 h-32', svg: 32, radius: 45, stroke: 8, text: 'text-2xl' },
    lg: { container: 'w-40 h-40', svg: 40, radius: 55, stroke: 10, text: 'text-3xl' },
  };

  const config = sizes[size];
  const center = config.svg * 4;
  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (isCritical) return '#EF4444'; // red-500
    if (isWarning) return '#F59E0B'; // yellow-500
    return '#3B82F6'; // blue-500
  };

  const getBgColor = () => {
    if (isCritical) return '#FEE2E2'; // red-100
    if (isWarning) return '#FEF3C7'; // yellow-100
    return '#DBEAFE'; // blue-100
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${config.container}`}>
        <svg
          className={`${config.container} transform -rotate-90`}
          viewBox={`0 0 ${center * 2} ${center * 2}`}
        >
          {/* Background Circle */}
          <circle
            cx={center}
            cy={center}
            r={config.radius}
            stroke={getBgColor()}
            strokeWidth={config.stroke}
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx={center}
            cy={center}
            r={config.radius}
            stroke={getColor()}
            strokeWidth={config.stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isCritical && (
            <AlertTriangle className="w-5 h-5 text-red-500 mb-1 animate-pulse" />
          )}
          <span className={`${config.text} font-bold`} style={{ color: getColor() }}>
            {hoursRemaining >= 0 ? hoursRemaining.toFixed(1) : '0.0'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">hours</span>
        </div>
      </div>

      {/* Label */}
      <div className="mt-2 text-center">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          of {maxHours}h
        </p>
      </div>

      {/* Warning Message */}
      {isWarning && !isCritical && (
        <div className="mt-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 rounded text-xs text-yellow-800 dark:text-yellow-300">
          Low time remaining
        </div>
      )}
      {isCritical && (
        <div className="mt-2 px-2 py-1 bg-red-100 dark:bg-red-900/20 rounded text-xs text-red-800 dark:text-red-300 font-medium">
          Limit exceeded
        </div>
      )}
    </div>
  );
};

export default HOSClock;

// Triple HOS Clock Display
export const HOSClockGroup: React.FC<{
  driveRemaining: number;
  shiftRemaining: number;
  cycleRemaining: number;
}> = ({ driveRemaining, shiftRemaining, cycleRemaining }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <HOSClock
        hoursRemaining={driveRemaining}
        maxHours={11}
        label="Drive Time"
        size="lg"
      />
      <HOSClock
        hoursRemaining={shiftRemaining}
        maxHours={14}
        label="Shift Time"
        size="lg"
      />
      <HOSClock
        hoursRemaining={cycleRemaining}
        maxHours={70}
        label="Cycle (70h/8d)"
        size="lg"
        warningThreshold={10}
      />
    </div>
  );
};