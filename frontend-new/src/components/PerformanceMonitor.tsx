'use client';

import React, { useEffect, useState } from 'react';

export const PerformanceMonitor: React.FC = () => {
  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState<any>(null);
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let frameId: number;

    const measureFps = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime >= lastTime + 1000) {
        setFps(Math.round(frameCount * 1000 / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;

        // Update memory usage if available
        if (window.performance && (performance as any).memory) {
          setMemory((performance as any).memory);
        }
      }

      frameId = requestAnimationFrame(measureFps);
    };

    frameId = requestAnimationFrame(measureFps);

    // Measure latency
    let lastPingTime = 0;
    const measureLatency = () => {
      lastPingTime = performance.now();
      requestAnimationFrame(() => {
        const currentTime = performance.now();
        setLatency(Math.round(currentTime - lastPingTime));
      });
    };

    const latencyInterval = setInterval(measureLatency, 1000);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(latencyInterval);
    };
  }, []);

  const getStatusClass = (value: number, type: 'fps' | 'latency') => {
    if (type === 'fps') {
      if (value >= 55) return 'good';
      if (value >= 30) return 'warning';
      return 'danger';
    } else {
      if (value <= 16) return 'good';
      if (value <= 32) return 'warning';
      return 'danger';
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 MB';
    const mb = bytes / 1024 / 1024;
    return `${Math.round(mb)} MB`;
  };

  return (
    <div className="performance-monitor">
      <div className="performance-stat">
        <span className="performance-label">FPS</span>
        <span className={`performance-value ${getStatusClass(fps, 'fps')}`}>
          {fps}
        </span>
      </div>
      <div className="performance-stat">
        <span className="performance-label">Latency</span>
        <span className={`performance-value ${getStatusClass(latency, 'latency')}`}>
          {latency}ms
        </span>
      </div>
      {memory && (
        <>
          <div className="performance-stat">
            <span className="performance-label">Used Memory</span>
            <span className="performance-value">
              {formatBytes(memory.usedJSHeapSize)}
            </span>
          </div>
          <div className="performance-stat">
            <span className="performance-label">Memory Limit</span>
            <span className="performance-value">
              {formatBytes(memory.jsHeapSizeLimit)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}; 