import { useEffect, useState } from 'react';
import { dashboardService, DashboardMetricsResponse, DashboardDocumentsMetricsResponse } from '@/lib/api/services/dashboard.service';
import { MetricTabs } from '@/components/dashboard/metric-tabs';
import { MetricCard } from '@/components/dashboard/metric-card';
import { FileText, CheckCircle2, Timer, AlertTriangle } from 'lucide-react';

export default function DashboardContainer() {
  const [metrics, setMetrics] = useState<DashboardMetricsResponse | null>(null);
  const [documentsMetrics, setDocumentsMetrics] = useState<DashboardDocumentsMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [metricsData, documentsData] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getDocumentsMetrics(),
      ]);
      setMetrics(metricsData);
      setDocumentsMetrics(documentsData);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando dashboard...</div>;

  const successRate = metrics?.processing_metrics?.success_rate;
  const avgProcessingTime = metrics?.processing_metrics?.avg_processing_time_ms;
  const pendingVerification = metrics?.processing_metrics?.pending_verification;

  // Format avg processing time safely
  const formattedAvgTime = (() => {
    if (avgProcessingTime === undefined || avgProcessingTime === null) return '—';
    const numValue = Number(avgProcessingTime);
    if (isNaN(numValue)) return '—';
    return `${numValue.toFixed(1)} ms`;
  })();

  return (
    <div className="space-y-6">
     
      <MetricTabs metrics={metrics} documentsMetrics={documentsMetrics} loading={loading} />
    </div>
  );
}