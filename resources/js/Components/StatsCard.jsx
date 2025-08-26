import React from "react";

const StatsCard = ({ number, label, color }) => {
	return (
		<div className="col-md-3">
			<div className="stats-card">
				<div className={`stats-number ${color}`}>{number}</div>
				<div className="text-muted">{label}</div>
			</div>
		</div>
	);
};

export default StatsCard;