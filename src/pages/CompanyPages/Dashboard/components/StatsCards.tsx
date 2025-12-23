import React from "react";
import { Card, Row, Col, Statistic, Progress } from "antd";
import { Megaphone, Briefcase, UploadCloud, Trophy, Clock } from "lucide-react";
import { DASHBOARD_COLORS } from "../constants/colors";

interface StatsData {
    totalMembers: number;
    activeJobs: number;
    aiProcessed: number;
    resumeCreditsRemaining: number;
    totalPublicCampaigns: number;
    comparisonCreditsRemaining: number;
    resumeTimeRemaining: string;
    comparisonTimeRemaining: string;
}

interface StatsCardsProps {
    stats: StatsData;
    hoveredCard: string | null;
    setHoveredCard: (card: string | null) => void;
}

const cardBaseStyle: React.CSSProperties = {
    borderRadius: 8,
    transition: "box-shadow 0.18s ease, transform 0.12s ease",
};

const StatsCards: React.FC<StatsCardsProps> = ({
    stats,
    hoveredCard,
    setHoveredCard,
}) => {
    // Helper function to format reset time
    const formatResetTime = (timeString: string) => {
        if (!timeString) return "--:--";
        
        try {
            const resetTime = new Date(timeString);
            const now = new Date();
            
            // Check if it's today
            const isToday = resetTime.toDateString() === now.toDateString();
            
            const hours = resetTime.getHours();
            const minutes = resetTime.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 || 12;
            const timeStr = `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
            
            if (isToday) {
                return `Today ${timeStr}`;
            } else {
                const month = resetTime.toLocaleDateString('en-US', { month: 'short' });
                const day = resetTime.getDate();
                return `${month} ${day}, ${timeStr}`;
            }
        } catch (error) {
            console.error('Error formatting reset time:', error, timeString);
            return "--:--";
        }
    };
    return (
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
            <Col xs={24} lg={4}>
                <Row gutter={[12, 12]}>
                    <Col xs={12} lg={24}>
                        <Card
                            size="small"
                            hoverable
                            style={{ ...cardBaseStyle, boxShadow: hoveredCard === "c1" ? "0 6px 18px rgba(0,0,0,0.08)" : undefined }}
                            onMouseEnter={() => setHoveredCard("c1")}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <Statistic title="Total Members" value={stats.totalMembers} prefix={<Megaphone color={DASHBOARD_COLORS.PRIMARY} size={18} />} valueStyle={{ color: DASHBOARD_COLORS.PRIMARY }} />
                        </Card>
                    </Col>
                    <Col xs={12} lg={24}>
                        <Card
                            size="small"
                            hoverable
                            style={{ ...cardBaseStyle, boxShadow: hoveredCard === "c3" ? "0 6px 18px rgba(0,0,0,0.08)" : undefined }}
                            onMouseEnter={() => setHoveredCard("c3")}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <Statistic title="AI Processed" value={stats.aiProcessed} prefix={<UploadCloud color={DASHBOARD_COLORS.PRIMARY_MEDIUM} size={18} />} valueStyle={{ color: DASHBOARD_COLORS.PRIMARY_MEDIUM }} />
                        </Card>
                    </Col>
                </Row>
            </Col>

            <Col xs={24} lg={4}>
                <Row gutter={[12, 12]}>
                    <Col xs={12} lg={24}>
                        <Card
                            size="small"
                            hoverable
                            style={{ ...cardBaseStyle, boxShadow: hoveredCard === "c2" ? "0 6px 18px rgba(0,0,0,0.08)" : undefined }}
                            onMouseEnter={() => setHoveredCard("c2")}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <Statistic title="Active Jobs" value={stats.activeJobs} prefix={<Briefcase color={DASHBOARD_COLORS.PRIMARY_LIGHT} size={18} />} valueStyle={{ color: DASHBOARD_COLORS.PRIMARY_LIGHT }} />
                        </Card>
                    </Col>
                    <Col xs={12} lg={24}>
                        <Card
                            size="small"
                            hoverable
                            style={{ ...cardBaseStyle, boxShadow: hoveredCard === "c3" ? "0 6px 18px rgba(0,0,0,0.08)" : undefined }}
                            onMouseEnter={() => setHoveredCard("c3")}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <Statistic title="Published Campaign" value={stats.totalPublicCampaigns} prefix={<UploadCloud color={DASHBOARD_COLORS.PRIMARY_DARK} size={18} />} valueStyle={{ color: DASHBOARD_COLORS.PRIMARY_DARK }} />
                        </Card>
                    </Col>
                </Row>
            </Col>

            <Col xs={24} lg={16}>
                <Row gutter={[12, 12]}>
                    <Col xs={12} lg={12}>
                        <Card
                            size="small"
                            hoverable
                            style={{
                                ...cardBaseStyle,
                                boxShadow: hoveredCard === "c4" ? "0 6px 18px rgba(0,0,0,0.08)" : undefined,
                                minHeight: 140
                            }}
                            onMouseEnter={() => setHoveredCard("c4")}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div style={{ padding: '8px 0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <Trophy color={DASHBOARD_COLORS.PRIMARY} size={18} />
                                    <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>Resume Credits</span>
                                </div>

                                <div style={{ marginBottom: 16 }}>
                                    <Progress
                                        percent={Math.min((stats.resumeCreditsRemaining / 100) * 100, 100)}
                                        strokeColor={stats.resumeCreditsRemaining > 100 ? DASHBOARD_COLORS.ERROR : DASHBOARD_COLORS.PRIMARY}
                                        trailColor="#f0f0f0"
                                        size="small"
                                        showInfo={false}
                                        strokeWidth={8}
                                    />
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: 4,
                                        fontSize: 11,
                                        color: '#666'
                                    }}>
                                        <span>0</span>
                                        <div style={{
                                            fontSize: 16,
                                            fontWeight: 700,
                                            color: stats.resumeCreditsRemaining > 100 ? DASHBOARD_COLORS.ERROR : DASHBOARD_COLORS.PRIMARY
                                        }}>
                                            {stats.resumeCreditsRemaining}
                                        </div>
                                        <span>100+</span>
                                    </div>
                                </div>

                                <div style={{
                                    fontSize: 11,
                                    color: '#666',
                                    marginBottom: 8,
                                    textAlign: 'center'
                                }}>
                                    Hourly Usage Limit: 100
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 4,
                                    fontSize: 10,
                                    color: '#999',
                                    background: '#f5f5f5',
                                    padding: '4px 8px',
                                    borderRadius: 4
                                }}>
                                    <Clock size={12} />
                                    <span>Reset at: {formatResetTime(stats.resumeTimeRemaining)}</span>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={12} lg={12}>
                        <Card
                            size="small"
                            hoverable
                            style={{
                                ...cardBaseStyle,
                                boxShadow: hoveredCard === "c5" ? "0 6px 18px rgba(0,0,0,0.08)" : undefined,
                                minHeight: 140
                            }}
                            onMouseEnter={() => setHoveredCard("c5")}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div style={{ padding: '8px 0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <Trophy color={DASHBOARD_COLORS.ACCENT} size={18} />
                                    <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>Compare Credits</span>
                                </div>

                                <div style={{ marginBottom: 16 }}>
                                    <Progress
                                        percent={Math.min((stats.comparisonCreditsRemaining / 100) * 100, 100)}
                                        strokeColor={stats.comparisonCreditsRemaining > 100 ? DASHBOARD_COLORS.ERROR : DASHBOARD_COLORS.ACCENT}
                                        trailColor="#f0f0f0"
                                        size="small"
                                        showInfo={false}
                                        strokeWidth={8}
                                    />
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: 4,
                                        fontSize: 11,
                                        color: '#666'
                                    }}>
                                        <span>0</span>
                                        <div style={{
                                            fontSize: 16,
                                            fontWeight: 700,
                                            color: stats.comparisonCreditsRemaining > 100 ? DASHBOARD_COLORS.ERROR : DASHBOARD_COLORS.ACCENT
                                        }}>
                                            {stats.comparisonCreditsRemaining}
                                        </div>
                                        <span>100+</span>
                                    </div>
                                </div>

                                <div style={{
                                    fontSize: 11,
                                    color: '#666',
                                    marginBottom: 8,
                                    textAlign: 'center'
                                }}>
                                    Hourly Usage Limit: 100
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 4,
                                    fontSize: 10,
                                    color: '#999',
                                    background: '#f5f5f5',
                                    padding: '4px 8px',
                                    borderRadius: 4
                                }}>
                                    <Clock size={12} />
                                    <span>Reset at: {formatResetTime(stats.comparisonTimeRemaining)}</span>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default StatsCards;