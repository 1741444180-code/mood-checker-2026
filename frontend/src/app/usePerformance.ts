import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  domProcessingTime: number;
  resourceCount: number;
  cpuUsage: number;
  memory: {
    usedHeapSize: number;
    totalHeapSize: number;
    jsHeapSize: number;
  };
  metrics: Array<{
    timestamp: number;
    value: number;
    label?: string;
  }>;
  events: Array<{
    name: string;
    duration: number;
  }>;
}

export const usePerformance = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const collectPerformanceData = async () => {
      try {
        setLoading(true);
        
        // Simulate collecting performance data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Collect actual performance metrics
        const navEntries = performance.getEntriesByType('navigation');
        const paintEntries = performance.getEntriesByType('paint');
        const resourceEntries = performance.getEntriesByType('resource');
        
        // Calculate page load time
        let pageLoadTime = 0;
        if (navEntries.length > 0) {
          const navEntry = navEntries[0] as PerformanceNavigationTiming;
          pageLoadTime = Math.round(navEntry.loadEventEnd - navEntry.startTime);
        }
        
        // Calculate DOM processing time
        let domProcessingTime = 0;
        if (navEntries.length > 0) {
          const navEntry = navEntries[0] as PerformanceNavigationTiming;
          domProcessingTime = Math.round(navEntry.domContentLoadedEventEnd - navEntry.responseEnd);
        }
        
        // Collect performance events
        const events = [];
        if (paintEntries.length >= 2) {
          const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
          const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
          
          if (firstPaint) {
            events.push({
              name: 'First Paint',
              duration: Math.round(firstPaint.startTime)
            });
          }
          
          if (firstContentfulPaint) {
            events.push({
              name: 'First Contentful Paint',
              duration: Math.round(firstContentfulPaint.startTime)
            });
          }
        }
        
        // Get memory information if available
        const memoryInfo = (performance as any).memory || {};
        const memory = {
          usedHeapSize: Math.round((memoryInfo.usedJSHeapSize || 0) / 1048576 * 100) / 100, // Convert to MB
          totalHeapSize: Math.round((memoryInfo.totalJSHeapSize || 0) / 1048576 * 100) / 100, // Convert to MB
          jsHeapSize: Math.round((memoryInfo.jsHeapSizeLimit || 0) / 1048576 * 100) / 100, // Convert to MB
        };
        
        // Generate mock CPU usage (since we can't directly measure CPU usage in browser)
        const cpuUsage = Math.floor(Math.random() * 30) + 10; // Random value between 10-40%
        
        // Generate mock performance metrics over time
        const metrics = [];
        const now = Date.now();
        for (let i = 9; i >= 0; i--) {
          metrics.push({
            timestamp: now - i * 60000, // Every minute
            value: Math.floor(Math.random() * 100) + 50, // Random value between 50-150
            label: `Metric ${i}`
          });
        }
        
        const data: PerformanceMetrics = {
          pageLoadTime,
          domProcessingTime,
          resourceCount: resourceEntries.length,
          cpuUsage,
          memory,
          metrics,
          events
        };
        
        setPerformanceData(data);
        
        // Set up performance observer for ongoing monitoring
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log(`${entry.name} took ${entry.duration} milliseconds`);
            
            // Report performance data to analytics endpoint
            // In a real implementation, you would send this to your backend
            if ('sendBeacon' in navigator) {
              navigator.sendBeacon('/api/performance', JSON.stringify({
                metric: entry.name,
                duration: entry.duration,
                timestamp: Date.now()
              }));
            }
          }
        });
        
        observer.observe({ entryTypes: ['measure', 'navigation', 'paint', 'resource'] });
        
        // Set up regular reporting of performance metrics
        const intervalId = setInterval(() => {
          // Collect fresh metrics periodically
          const freshNavEntries = performance.getEntriesByType('navigation');
          const freshPaintEntries = performance.getEntriesByType('paint');
          const freshResourceEntries = performance.getEntriesByType('resource');
          
          const freshPageLoadTime = freshNavEntries.length > 0 
            ? Math.round((freshNavEntries[0] as PerformanceNavigationTiming).loadEventEnd - (freshNavEntries[0] as PerformanceNavigationTiming).startTime) 
            : 0;
          
          const freshDomProcessingTime = freshNavEntries.length > 0 
            ? Math.round((freshNavEntries[0] as PerformanceNavigationTiming).domContentLoadedEventEnd - (freshNavEntries[0] as PerformanceNavigationTiming).responseEnd) 
            : 0;
          
          const freshEvents = [];
          if (freshPaintEntries.length >= 2) {
            const firstPaint = freshPaintEntries.find(entry => entry.name === 'first-paint');
            const firstContentfulPaint = freshPaintEntries.find(entry => entry.name === 'first-contentful-paint');
            
            if (firstPaint) {
              freshEvents.push({
                name: 'First Paint',
                duration: Math.round(firstPaint.startTime)
              });
            }
            
            if (firstContentfulPaint) {
              freshEvents.push({
                name: 'First Contentful Paint',
                duration: Math.round(firstContentfulPaint.startTime)
              });
            }
          }
          
          const freshData: PerformanceMetrics = {
            ...data,
            pageLoadTime: freshPageLoadTime,
            domProcessingTime: freshDomProcessingTime,
            resourceCount: freshResourceEntries.length,
            events: freshEvents,
            metrics: [...data.metrics.slice(1), {
              timestamp: Date.now(),
              value: Math.floor(Math.random() * 100) + 50,
              label: `Metric ${Date.now()}`
            }]
          };
          
          setPerformanceData(freshData);
        }, 5000); // Update every 5 seconds
        
        // Clean up interval on unmount
        return () => {
          clearInterval(intervalId);
          observer.disconnect();
        };
      } catch (err) {
        console.error('Error collecting performance data:', err);
        setError('Failed to collect performance data');
      } finally {
        setLoading(false);
      }
    };

    collectPerformanceData();
  }, []);

  return { performanceData, loading, error };
};