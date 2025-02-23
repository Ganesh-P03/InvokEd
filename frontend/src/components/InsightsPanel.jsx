import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
  Box,
} from "@mui/material";
import { queryService } from "../services/ai_engine_api";

const InsightsPanel = ({ data }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await queryService.getInsights(data);
        setInsights(response);
      } catch (err) {
        setError("❌ Failed to fetch insights");
      } finally {
        setLoading(false);
      }
    };

    if (data) {
      fetchInsights();
    }
  }, [data]);

  const insightTitles = {
    1: "📊 Data Trend",
    2: "🔎 Key Observation",
    3: "💡 Actionable Insight"
  };

  return (
    <Card sx={{ minWidth: 400, backgroundColor: "#f5f5f5", p: 2, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🚀 AI Powered Insights
        </Typography>
        {loading ? (
          <CircularProgress size={24} />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : insights ? (
          <Box display="flex" flexDirection="column" gap={2}>
            {Object.entries(insights).map(([key, value]) => (
              <Paper key={key} elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6">{insightTitles[key] || "🔍 Insight"}</Typography>
                <Typography variant="body1">{value} 🎯</Typography>
              </Paper>
            ))}
          </Box>
        ) : (
          <Typography>⚠️ No insights available</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightsPanel;
