const StatCard = ({ icon, label, value, color = '#4f46e5' }) => (
  <div className="stat-card" style={{ borderTopColor: color }}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  </div>
);

export default StatCard;
