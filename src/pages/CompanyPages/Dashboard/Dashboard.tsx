import React, { useEffect, useState } from "react";
import { Card, Row, message, Spin } from "antd";
import { useAppSelector } from "../../../hooks/redux";
import dashboardService from "../../../services/dashboardService";
import { campaignService } from "../../../services/campaignService";

// Import components
import DashboardHeader from "./components/DashboardHeader";
import StatsCards from "./components/StatsCards";
import RecruitmentFunnel from "./components/RecruitmentFunnel";
import UsageHistory from "./components/UsageHistory";
import StatsOverview from "./components/StatsOverview";
import CategorySpecChart from "./components/CategorySpecChart";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const user = useAppSelector((state) => state.auth.user);
  const displayName = user?.fullName ?? "User";
  
  // Get first name only
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0] || 'User';
  };
  
  const getTimeGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get time-based emoji
  const getTimeEmoji = () => {
    const h = new Date().getHours();
    if (h >= 6 && h < 12) return "☀️";
    if (h >= 12 && h < 18) return "🌤️";
    if (h >= 18 && h < 22) return "🌆";
    return "🌙";
  };

  const [timeGreeting, setTimeGreeting] = useState<string>(getTimeGreeting());
  const [stats, setStats] = useState({ 
    totalMembers: 0, 
    activeJobs: 0, 
    aiProcessed: 0, 
    resumeCreditsRemaining: 0, 
    totalPublicCampaigns: 0,
    comparisonCreditsRemaining: 0,
    resumeTimeRemaining: '',
    comparisonTimeRemaining: '',
    maxResumeCredits: 0,
    maxComparisonCredits: 0
  });
  const [funnel, setFunnel] = useState<Array<{ stage: string; value: number; conversionRate?: number }>>([]);
  const [funnelLoading, setFunnelLoading] = useState(false);
  const [jobIdParam, setJobIdParam] = useState<string | undefined>(undefined);
  const [campaignIdParam, setCampaignIdParam] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<any | null>(null);
  const [usageHistory, setUsageHistory] = useState<any>(null);
  const [usageRange, setUsageRange] = useState<string>("month");
  const [usageLoading, setUsageLoading] = useState(false);
  const [statsOverview, setStatsOverview] = useState<any>(null);
  const [topCategorySpec, setTopCategorySpec] = useState<any[]>([]);
  const [topCount, setTopCount] = useState<number>(10);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [campaignsList, setCampaignsList] = useState<any[]>([]);
  const [filteredJobsList, setFilteredJobsList] = useState<any[]>([]);

  useEffect(() => {
    const id = setInterval(() => setTimeGreeting(getTimeGreeting()), 60000);
    return () => clearInterval(id);
  }, []);

  const applyFunnelParams = async () => {
    try {
      setFunnelLoading(true);
      const params: any = {};
      if (jobIdParam) params.jobId = Number(jobIdParam);
      if (campaignIdParam) params.campaignId = Number(campaignIdParam);
      if (dateRange && Array.isArray(dateRange) && dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0].toISOString();
        params.endDate = dateRange[1].toISOString();
      }
      const pipeline = await dashboardService.getPipelineFunnel?.(params);
      const apiStages = (pipeline && (pipeline.stages || pipeline.data?.stages)) ?? null;
      if (Array.isArray(apiStages) && apiStages.length > 0) {
        setFunnel(apiStages.map((s: any) => ({ stage: s.name ?? s.stage ?? 'Unknown', value: Number(s.count ?? 0), conversionRate: Number(s.conversionRate ?? 0) })) as any);
      } else {
        message.info('No funnel data for the provided parameters');
        setFunnel([]);
      }
    } catch (err) {
      console.error('applyFunnelParams error', err);
      message.error('Failed to load funnel data');
    } finally {
      setFunnelLoading(false);
    }
  };

  const resetFunnel = async () => {
    setJobIdParam(undefined);
    setCampaignIdParam(undefined);
    setDateRange(null);
    setFunnelLoading(true);
    try {
      const p = await dashboardService.getPipelineFunnel?.();
      const apiStages = (p && (p.stages || p.data?.stages)) ?? null;
      if (Array.isArray(apiStages)) {
        setFunnel(apiStages.map((s: any) => ({
          stage: s.name ?? s.stage ?? 'Unknown',
          value: Number(s.count ?? 0),
          conversionRate: Number(s.conversionRate ?? 0)
        })));
      } else {
        setFunnel([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFunnelLoading(false);
    }
  };

  const fetchTopCategorySpec = async () => {
    try {
      const topCatData = await dashboardService.getTopCategorySpec(topCount);
      if (topCatData?.status === 'Success' && topCatData?.data) {
        const data = topCatData.data.data || topCatData.data || [];
        setTopCategorySpec(Array.isArray(data) ? data : []);
      } else {
        setTopCategorySpec(Array.isArray(topCatData) ? topCatData : []);
      }
    } catch (err) {
      console.error('Failed to load top category spec', err);
      setTopCategorySpec([]);
    }
  };

  const fetchJobsAndCampaigns = async () => {
    try {
      const campaignsResp = await campaignService.getCampaigns();
      
      // Handle different response structures
      let campaignsData = [];
      if (campaignsResp?.data?.campaigns) {
        campaignsData = campaignsResp.data.campaigns;
      } else if (campaignsResp?.data && Array.isArray(campaignsResp.data)) {
        campaignsData = campaignsResp.data;
      } else if (Array.isArray(campaignsResp)) {
        campaignsData = campaignsResp;
      }
      
      const formattedCampaigns = campaignsData.map((campaign: any) => ({
        value: campaign.campaignId || campaign.id,
        label: campaign.title || campaign.name || `Campaign ${campaign.campaignId || campaign.id}`
      }));
      
      setCampaignsList(formattedCampaigns);
    } catch (err) {
      console.error('Failed to load campaigns', err);
      message.error('Failed to load campaigns');
    }
  };

  const handleCampaignChange = async (campaignId: string | undefined) => {
    setCampaignIdParam(campaignId);
    setJobIdParam(undefined);
    
    if (campaignId) {
      try {
        const jobsResp = await campaignService.getCampaignJobs(Number(campaignId));
        
        // Handle different response structures
        let jobsData: any[] = [];
        if (jobsResp?.data?.jobs) {
          jobsData = jobsResp.data.jobs;
        } else if (jobsResp?.data) {
          jobsData = Array.isArray(jobsResp.data) ? jobsResp.data : [jobsResp.data];
        } else if (Array.isArray(jobsResp)) {
          jobsData = jobsResp;
        }
        
        const formattedJobs = jobsData.map((job: any) => ({
          value: job.id || job.jobId,
          label: job.title || job.jobTitle || `Job ${job.id || job.jobId}`
        }));
        
        setFilteredJobsList(formattedJobs);
      } catch (err) {
        console.error('Failed to load campaign jobs', err);
        message.error('Failed to load jobs for selected campaign');
        setFilteredJobsList([]);
      }
    } else {
      setFilteredJobsList([]);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const [summary]: [any] = await Promise.all([
          dashboardService.getSummary(),
        ]);

        if (summary) {
          const summaryData = summary?.data ?? summary;
          setStats({
            totalMembers: summaryData.totalMembers ?? 0,
            activeJobs: summaryData.activeJobs ?? 0,
            aiProcessed: summaryData.aiProcessed ?? 0,
            resumeCreditsRemaining: summaryData.resumeCreditsRemaining ?? 0,
            totalPublicCampaigns: summaryData.totalPublicCampaigns ?? 0,
            comparisonCreditsRemaining: summaryData.comparisonCreditsRemaining ?? 0,
            resumeTimeRemaining: summaryData.resumeTimeRemaining ?? '',
            comparisonTimeRemaining: summaryData.comparisonTimeRemaining ?? '',
            maxResumeCredits: summaryData.maxResumeCredits ?? 0,
            maxComparisonCredits: summaryData.maxComparisonCredits ?? 0,
          });
        }

        const fetchDefaultPipeline = async () => {
          try {
            setFunnelLoading(true);
            const pipeline = await dashboardService.getPipelineFunnel?.();
            const apiStages = (pipeline && (pipeline.stages || pipeline.data?.stages)) ?? null;
            if (Array.isArray(apiStages) && apiStages.length > 0) {
              setFunnel(apiStages.map((s: any) => ({ stage: s.name ?? s.stage ?? 'Unknown', value: Number(s.count ?? 0), conversionRate: Number(s.conversionRate ?? 0) })) as any);
            } else {
              const summaryData = summary?.data ?? summary;
              const totalCandidates = summaryData?.totalCandidates ?? 0;
              const cvHired = summaryData?.cvHired ?? 0;
              setFunnel([
                { stage: "Total Members", value: totalCandidates, conversionRate: 100 },
                { stage: "Active Jobs", value: Math.round(totalCandidates * 0.6), conversionRate: Math.round(60 * 100) / 100 },
                { stage: "AI Processed", value: Math.round(totalCandidates * 0.12), conversionRate: Math.round(12 * 100) / 100 },
                { stage: "Credits Remaining", value: cvHired, conversionRate: Math.round((cvHired / Math.max(1, totalCandidates)) * 100 * 100) / 100 },
              ] as any);
            }
          } catch (e) {
            console.error('Failed to fetch pipeline funnel', e);
          } finally {
            setFunnelLoading(false);
          }
        };

        await fetchDefaultPipeline();

        try {
          setUsageLoading(true);
          const usageData = await dashboardService.getSubscriptionUsageHistory(usageRange);
          setUsageHistory(usageData);
        } catch (err) {
          console.error('Failed to load usage history', err);
          // Set fallback data for testing
          setUsageHistory({
            range: 'month',
            unit: 'day',
            labels: ['Dec 20', 'Dec 21', 'Dec 22'],
            resumeUploads: [10, 15, 8],
            aiComparisons: [5, 12, 3],
            resumeLimit: 100,
            aiComparisonLimit: 50
          });
        } finally {
          setUsageLoading(false);
        }

        try {
          const statsData = await dashboardService.getStatsOverview();
          setStatsOverview(statsData);
        } catch (err) {
          console.error('Failed to load stats overview', err);
        }

        await fetchTopCategorySpec();
        await fetchJobsAndCampaigns();
      } catch (e) {
        message.error("Cannot load dashboard");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    fetchTopCategorySpec();
  }, [topCount]);

  const handleUsageRangeChange = async (newRange: string) => {
    setUsageRange(newRange);
    try {
      setUsageLoading(true);
      const usageData = await dashboardService.getSubscriptionUsageHistory(newRange);
      setUsageHistory(usageData);
    } catch (err) {
      console.error('Failed to load usage history', err);
      message.error('Failed to load usage history');
      setUsageHistory({
        range: newRange,
        unit: 'day',
        labels: ['Sample 1', 'Sample 2', 'Sample 3'],
        resumeUploads: [5, 10, 7],
        aiComparisons: [2, 8, 4],
        resumeLimit: 100,
        aiComparisonLimit: 50
      });
    } finally {
      setUsageLoading(false);
    }
  };

  return (
    <Card
      title={
        <DashboardHeader
          displayName={displayName}
          timeGreeting={timeGreeting}
          getFirstName={getFirstName}
          getTimeEmoji={getTimeEmoji}
        />
      }
      style={{ maxWidth: 1200, margin: "12px auto", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", minHeight: 480 }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <StatsCards
            stats={stats}
            hoveredCard={hoveredCard}
            setHoveredCard={setHoveredCard}
          />

          <Row gutter={[12, 12]} style={{ marginTop: 8 }}>
            <RecruitmentFunnel
              funnel={funnel}
              funnelLoading={funnelLoading}
              campaignsList={campaignsList}
              filteredJobsList={filteredJobsList}
              campaignIdParam={campaignIdParam}
              jobIdParam={jobIdParam}
              dateRange={dateRange}
              setCampaignIdParam={setCampaignIdParam}
              setJobIdParam={setJobIdParam}
              setDateRange={setDateRange}
              handleCampaignChange={handleCampaignChange}
              applyFunnelParams={applyFunnelParams}
              resetFunnel={resetFunnel}
            />

            <UsageHistory
              usageHistory={usageHistory}
              usageLoading={usageLoading}
              usageRange={usageRange}
              handleUsageRangeChange={handleUsageRangeChange}
            />

            <StatsOverview statsOverview={statsOverview} />

            <CategorySpecChart
              topCategorySpec={topCategorySpec}
              topCount={topCount}
              setTopCount={setTopCount}
            />
          </Row>
        </>
      )}
    </Card>
  );
};

export default Dashboard;
