import React from "react";

interface DashboardHeaderProps {
  displayName: string;
  timeGreeting: string;
  getFirstName: (fullName: string) => string;
  getTimeEmoji: () => string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  displayName,
  timeGreeting,
  getFirstName,
  getTimeEmoji,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center"}}>
      <span style={{ fontSize: 20 }}>{getTimeEmoji()}</span>
      <div>
        {timeGreeting}, {getFirstName(displayName)}! Welcome back to your dashboard
      </div>
    </div>
  );
};

export default DashboardHeader;