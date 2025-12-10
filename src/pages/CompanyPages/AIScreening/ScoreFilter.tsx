import React from "react";
import { Input, Button } from "antd";

interface ScoreFilterProps {
	scoreFilter: {
		min: number | null;
		max: number | null;
	};
	onFilterChange: (filter: { min: number | null; max: number | null }) => void;
}

const ScoreFilter: React.FC<ScoreFilterProps> = ({
	scoreFilter,
	onFilterChange,
}) => {
	return (
		<div
			style={{
				display: "flex",
				gap: 8,
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Input
				type="number"
				placeholder="Min score"
				style={{ width: 105 }}
				value={scoreFilter.min ?? ""}
				onChange={(e) => {
					const val = e.target.value === "" ? null : Number(e.target.value);
					onFilterChange({ ...scoreFilter, min: val });
				}}
			/>
			<span>-</span>
			<Input
				type="number"
				placeholder="Max score"
				style={{ width: 105 }}
				value={scoreFilter.max ?? ""}
				onChange={(e) => {
					const val = e.target.value === "" ? null : Number(e.target.value);
					onFilterChange({ ...scoreFilter, max: val });
				}}
			/>
			{(scoreFilter.min !== null || scoreFilter.max !== null) && (
				<Button
                    className="company-btn"
					size="small"
					onClick={() => onFilterChange({ min: null, max: null })}
				>
					Clear
				</Button>
			)}
		</div>
	);
};

export default ScoreFilter;
