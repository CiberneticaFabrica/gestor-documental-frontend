import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string; // Tailwind color class para el valor
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, color = 'text-blue-600', icon }) => {
  // Animación de conteo para valores numéricos
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (typeof value === 'number') {
      let start = prevValue.current as number;
      let end = value as number;
      let startTimestamp: number | null = null;
      const duration = 900;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        setDisplayValue(current);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setDisplayValue(end);
        }
      };
      requestAnimationFrame(step);
      prevValue.current = value;
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(56, 189, 248, 0.15)' }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow flex flex-col gap-2 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p className={`text-3xl font-bold ${color} mt-2`}>
        {typeof value === 'number' ? displayValue : value}
      </p>
      {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
    </motion.div>
  );
}; 