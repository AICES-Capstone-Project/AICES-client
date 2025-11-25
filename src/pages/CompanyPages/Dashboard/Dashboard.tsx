import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table, Tabs, Spin, Empty, Progress } from "antd";
import {
	FundOutlined,
	FileTextOutlined,
	TrophyOutlined,
} from "@ant-design/icons";
import {
	BarChart,
	Bar,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { jobService } from "../../../services/jobService";
import { companyService } from "../../../services/companyService";

const { TabPane } = Tabs;

const COLORS = ["#52c41a", "#ff4d4f", "#1890ff", "#faad14", "#722ed1", "#eb2f96"];

interface DashboardStats {
	activeJobs: number;
	newJobs: number;
	totalJobs: number;
	cvsToday: number;
	cvsThisWeek: number;
	cvsThisMonth: number;
	cvsTotal: number;
	aiScreenedSuccess: number;
	pendingScreening: number;
	highScore: number;
	lowScore: number;
}

interface TopCV {
	resumeId: number;
	fullName: string;
	jobTitle: string;
	score: number;
	category: string;
	uploadDate: string;
}

const Dashboard = () => {
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState<DashboardStats>({
		activeJobs: 0,
		newJobs: 0,
		totalJobs: 0,
		cvsToday: 0,
		cvsThisWeek: 0,
		cvsThisMonth: 0,
		cvsTotal: 0,
		aiScreenedSuccess: 0,
		pendingScreening: 0,
		highScore: 0,
		lowScore: 0,
	});
	const [topCVs, setTopCVs] = useState<TopCV[]>([]);
	const [topCVsFilter, setTopCVsFilter] = useState<string>("all");

	useEffect(() => {
		loadDashboardData();
	}, []);

	const loadDashboardData = async () => {
		try {
			setLoading(true);

			// Get company info to get companyId
			const companyResp = await companyService.getSelf();
			if (companyResp.status === "Success" && companyResp.data) {
				const cId = companyResp.data.companyId;

				// Load all data in parallel
				await Promise.all([
					loadJobStats(cId),
					loadCVStats(),
					loadTopCVs(cId),
				]);
			}
		} catch (error) {
			console.error("Failed to load dashboard data:", error);
		} finally {
			setLoading(false);
		}
	};

	const loadJobStats = async (_cId: number) => {
		try {
			// Get all jobs to calculate stats
			const publishedResp = await jobService.getCompanyJobs(1, 100);
			const pendingResp = await jobService.getPendingJobs(1, 100);

			let activeCount = 0;
			let newCount = 0;
			let totalCount = 0;

			if (publishedResp.status === "Success" && publishedResp.data?.jobs) {
				const publishedJobs = publishedResp.data.jobs;
				totalCount += publishedJobs.length;
				activeCount = publishedJobs.filter(
					(j) => j.jobStatus === "Published"
				).length;

				// Jobs created in last 7 days are "new"
				const weekAgo = new Date();
				weekAgo.setDate(weekAgo.getDate() - 7);
				newCount = publishedJobs.filter(
					(j) => new Date(j.createdAt) >= weekAgo
				).length;
			}

			if (pendingResp.status === "Success" && pendingResp.data?.jobs) {
				totalCount += pendingResp.data.jobs.length;
			}

			setStats((prev) => ({
				...prev,
				activeJobs: activeCount,
				newJobs: newCount,
				totalJobs: totalCount,
			}));
		} catch (error) {
			console.error("Failed to load job stats:", error);
		}
	};

	const loadCVStats = async () => {
		try {
			// Get all jobs first
			const jobsResp = await jobService.getCompanyJobs(1, 100);
			if (jobsResp.status !== "Success" || !jobsResp.data?.jobs) return;

			const jobs = jobsResp.data.jobs;
			let allResumes: any[] = [];

			// Fetch resumes for each job
		for (const job of jobs.slice(0, 10)) {
			// Limit to first 10 jobs to avoid too many requests
			try {
				const resumesResp = await companyService.getResumes(
					job.jobId,
					{ page: 1, pageSize: 100 }
				);
				if (resumesResp.status === "Success" && resumesResp.data?.items) {
					allResumes = [...allResumes, ...resumesResp.data.items];
				}
			} catch (err) {
				// Skip if no resumes for this job
				console.log(`No resumes for job ${job.jobId}`);
			}
		}			// Calculate CV stats based on dates
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			const weekAgo = new Date(today);
			weekAgo.setDate(weekAgo.getDate() - 7);
			const monthAgo = new Date(today);
			monthAgo.setMonth(monthAgo.getMonth() - 1);

			let cvsToday = 0;
			let cvsWeek = 0;
			let cvsMonth = 0;
			let aiScreened = 0;
			let pending = 0;
			let highScore = 0;
			let lowScore = 0;

			allResumes.forEach((resume) => {
				const uploadDate = resume.uploadedAt
					? new Date(resume.uploadedAt)
					: new Date();

				if (uploadDate >= today) cvsToday++;
				if (uploadDate >= weekAgo) cvsWeek++;
				if (uploadDate >= monthAgo) cvsMonth++;

				// AI Screening stats
				if (resume.status === "Screened" || resume.totalResumeScore != null) {
					aiScreened++;
				} else if (resume.status === "Pending") {
					pending++;
				}

				// Score distribution
				if (resume.totalResumeScore != null) {
					if (resume.totalResumeScore >= 50) {
						highScore++;
					} else {
						lowScore++;
					}
				}
			});

			setStats((prev) => ({
				...prev,
				cvsToday,
				cvsThisWeek: cvsWeek,
				cvsThisMonth: cvsMonth,
				cvsTotal: allResumes.length,
				aiScreenedSuccess: aiScreened,
				pendingScreening: pending,
				highScore,
				lowScore,
			}));
		} catch (error) {
			console.error("Failed to load CV stats:", error);
		}
	};

	const loadTopCVs = async (_cId: number) => {
		try {
			// Get all jobs
			const jobsResp = await jobService.getCompanyJobs(1, 100);
			if (jobsResp.status !== "Success" || !jobsResp.data?.jobs) return;

			const jobs = jobsResp.data.jobs;
			let allResumesWithDetails: TopCV[] = [];

			// Fetch resumes for each job and build top CVs list
			for (const job of jobs.slice(0, 10)) {
				try {
					const resumesResp = await companyService.getResumes(
						job.jobId,
						{ page: 1, pageSize: 100 }
					);
					if (resumesResp.status === "Success" && resumesResp.data?.items) {
						const resumes = resumesResp.data.items;
						resumes.forEach((resume: any) => {
							if (resume.totalResumeScore != null) {
								allResumesWithDetails.push({
									resumeId: resume.resumeId,
									fullName: resume.fullName || "Unknown",
									jobTitle: job.title,
									score: resume.totalResumeScore,
									category: job.categoryName || "Uncategorized",
									uploadDate: resume.uploadedAt || new Date().toISOString(),
								});
							}
						});
					}
				} catch (err) {
					console.log(`No resumes for job ${job.jobId}`);
				}
			}

			// Sort by score and take top 100
			allResumesWithDetails.sort((a, b) => b.score - a.score);
			setTopCVs(allResumesWithDetails.slice(0, 100));
		} catch (error) {
			console.error("Failed to load top CVs:", error);
		}
	};

	const getFilteredTopCVs = (): TopCV[] => {
		if (!topCVs || topCVs.length === 0) return [];
		if (topCVsFilter === "all") return topCVs;
		return topCVs.filter((cv) => cv.category === topCVsFilter);
	};

	const topCVsColumns = [
		{
			title: "Rank",
			key: "rank",
			width: 60,
			render: (_: any, __: any, index: number) => (
				<span className="font-bold text-blue-600">#{index + 1}</span>
			),
		},
		{
			title: "Candidate Name",
			dataIndex: "fullName",
			key: "fullName",
			render: (text: string) => <span className="font-medium">{text}</span>,
		},
		{
			title: "Job Title",
			dataIndex: "jobTitle",
			key: "jobTitle",
		},
		{
			title: "Category",
			dataIndex: "category",
			key: "category",
			render: (category: string) => (
				<span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">
					{category}
				</span>
			),
		},
		{
			title: "Score",
			dataIndex: "score",
			key: "score",
			render: (score: number) => (
				<div className="flex items-center gap-2">
					<Progress
						percent={score}
						size="small"
						strokeColor={score >= 80 ? "#52c41a" : score >= 50 ? "#faad14" : "#ff4d4f"}
						style={{ width: 100 }}
					/>
					<span className="font-semibold">{score}%</span>
				</div>
			),
			sorter: (a: TopCV, b: TopCV) => b.score - a.score,
		},
		{
			title: "Upload Date",
			dataIndex: "uploadDate",
			key: "uploadDate",
			render: (date: string) => new Date(date).toLocaleDateString(),
		},
	];

	const uniqueCategories =
		topCVs.length > 0 ? [...new Set(topCVs.map((cv) => cv.category))] : [];

	// Prepare chart data
	const cvStatsChartData = [
		{ name: "Today", count: stats.cvsToday },
		{ name: "This Week", count: stats.cvsThisWeek },
		{ name: "This Month", count: stats.cvsThisMonth },
		{ name: "Total", count: stats.cvsTotal },
	];

	const jobStatsChartData = [
		{ name: "Active", count: stats.activeJobs, fill: "#3f8600" },
		{ name: "New", count: stats.newJobs, fill: "#1890ff" },
		{ name: "Total", count: stats.totalJobs, fill: "#722ed1" },
	];

	const screeningPieData = [
		{ name: "Screened", value: stats.aiScreenedSuccess },
		{ name: "Pending", value: stats.pendingScreening },
	];

	const scorePieData = [
		{ name: "Score ≥ 50%", value: stats.highScore },
		{ name: "Score < 50%", value: stats.lowScore },
	];

	const categoryDistribution = uniqueCategories.map((category) => ({
		name: category,
		count: topCVs.filter((cv) => cv.category === category).length,
	}));

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[400px] flex-col">
				<Spin size="large" tip="Loading dashboard data..." />
			</div>
		);
	}

	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			<h1 className="text-3xl font-bold mb-6 text-gray-900">Company Dashboard</h1>

			{/* Job Statistics */}
			<Row gutter={[16, 16]} className="mb-4">
				<Col xs={24} sm={12} lg={8}>
					<Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-green-600">
						<Statistic
							title="Active Jobs"
							value={stats.activeJobs}
							prefix={<FundOutlined />}
							valueStyle={{ color: "#3f8600" }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={8}>
					<Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-green-500">
						<Statistic
							title="New Jobs Created"
							value={stats.newJobs}
							prefix={<FundOutlined />}
							valueStyle={{ color: "#1890ff" }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={8}>
					<Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-blue-500">
						<Statistic
							title="Total Jobs"
							value={stats.totalJobs}
							prefix={<FundOutlined />}
							valueStyle={{ color: "#722ed1" }}
						/>
					</Card>
				</Col>
			</Row>

			{/* CV Statistics */}
			<h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800 flex items-center gap-2">CV Upload Statistics</h2>
			<Row gutter={[16, 16]} className="mb-4">
				<Col xs={24} sm={12} lg={6}>
					<Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-orange-500">
						<Statistic
							title="CVs Today"
							value={stats.cvsToday}
							prefix={<FileTextOutlined />}
							valueStyle={{ color: "#fa8c16" }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-cyan-500">
						<Statistic
							title="CVs This Week"
							value={stats.cvsThisWeek}
							prefix={<FileTextOutlined />}
							valueStyle={{ color: "#13c2c2" }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-purple-600">
						<Statistic
							title="CVs This Month"
							value={stats.cvsThisMonth}
							prefix={<FileTextOutlined />}
							valueStyle={{ color: "#722ed1" }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={12} lg={6}>
					<Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-pink-600">
						<Statistic
							title="Total CVs"
							value={stats.cvsTotal}
							prefix={<FileTextOutlined />}
							valueStyle={{ color: "#eb2f96" }}
						/>
					</Card>
				</Col>
			</Row>

			{/* Charts Section */}
			<Row gutter={[16, 16]} className="mb-4">
				{/* Job Statistics Chart */}
				<Col xs={24} lg={8}>
					<Card className="rounded-xl shadow-md" title="Job Statistics">
						<ResponsiveContainer width="100%" height={250}>
							<BarChart data={jobStatsChartData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Bar dataKey="count" fill="#1890ff" />
							</BarChart>
						</ResponsiveContainer>
					</Card>
				</Col>

				{/* CV Upload Trend */}
				<Col xs={24} lg={8}>
					<Card className="rounded-xl shadow-md" title="CV Upload Trend">
						<ResponsiveContainer width="100%" height={250}>
							<LineChart data={cvStatsChartData}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="name" />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line
									type="monotone"
									dataKey="count"
									stroke="#52c41a"
									strokeWidth={2}
									name="CVs Uploaded"
								/>
							</LineChart>
						</ResponsiveContainer>
					</Card>
				</Col>

				{/* AI Screening Status */}
				<Col xs={24} lg={8}>
					<Card className="rounded-xl shadow-md" title="AI Screening Status">
						<ResponsiveContainer width="100%" height={250}>
							<PieChart>
								<Pie
									data={screeningPieData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, value }) => `${name}: ${value}`}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
								>
									{screeningPieData.map((_entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</Card>
				</Col>
			</Row>

			{/* Score Distribution & Category Distribution */}
			<Row gutter={[16, 16]} className="mb-4">
				<Col xs={24} lg={12}>
					<Card className="rounded-xl shadow-md" title="Score Distribution">
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={scorePieData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, value, percent }) =>
										`${name}: ${value} (${((percent || 0) * 100).toFixed(0)}%)`
									}
									outerRadius={100}
									fill="#8884d8"
									dataKey="value"
								>
									<Cell fill="#52c41a" />
									<Cell fill="#ff4d4f" />
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</Card>
				</Col>

				{categoryDistribution.length > 0 && (
					<Col xs={24} lg={12}>
						<Card className="rounded-xl shadow-md" title="Top CVs by Category">
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={categoryDistribution}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="count" fill="#722ed1" />
								</BarChart>
							</ResponsiveContainer>
						</Card>
					</Col>
				)}
			</Row>

			{/* Top 100 CVs */}
			<h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800 flex items-center gap-2">
				<TrophyOutlined /> Top CVs by Score
			</h2>
			<Card className="rounded-xl shadow-md mb-6">
				{topCVs.length > 0 ? (
					<>
						<Tabs
							defaultActiveKey="all"
							onChange={(key) => setTopCVsFilter(key)}
							tabBarStyle={{ marginBottom: 16 }}
						>
							<TabPane tab="All Categories" key="all" />
							{uniqueCategories.map((category) => (
								<TabPane tab={category} key={category} />
							))}
						</Tabs>
						<Table
							columns={topCVsColumns}
							dataSource={getFilteredTopCVs()}
							rowKey="resumeId"
							pagination={{
								pageSize: 20,
								showSizeChanger: true,
								showTotal: (total) => `Total ${total} CVs`,
							}}
							scroll={{ x: 800 }}
						/>
					</>
				) : (
					<Empty description="No CVs with scores yet" />
				)}
			</Card>
		</div>
	);
};

export default Dashboard;
