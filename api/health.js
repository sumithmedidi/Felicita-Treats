// Health check endpoint for uptime and monitoring
module.exports = (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "felicita-treats-api",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0)
  });
};
