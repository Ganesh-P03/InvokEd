import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Typography, 
  CircularProgress, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow 
} from "@mui/material";
import axios from "axios";

const BotPage = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (url) {
      axios.get(url)
        .then((res) => {
          setResponse(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching backend data:", error);
          setResponse({ error: "Failed to fetch data" });
          setLoading(false);
        });
    }
  }, [url]);

  // Function to check if response is an array
  const isArrayResponse = (data) => Array.isArray(data);

  // Function to get table headers from JSON
  const getTableHeaders = (data) => {
    if (isArrayResponse(data) && data.length > 0) {
      return Object.keys(data[0]); // Get keys from first object in array
    } else if (typeof data === "object" && data !== null) {
      return Object.keys(data); // Treat single JSON as table with one row
    }
    return [];
  };

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Bot Response</Typography>

      {loading ? (
        <CircularProgress />
      ) : response && Object.keys(response).length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {getTableHeaders(response).map((header) => (
                  <TableCell key={header} sx={{ fontWeight: "bold" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isArrayResponse(response) ? (
                response.map((row, index) => (
                  <TableRow key={index}>
                    {getTableHeaders(response).map((header) => (
                      <TableCell key={header}>
                        {typeof row[header] === "object" ? JSON.stringify(row[header]) : row[header]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  {getTableHeaders(response).map((header) => (
                    <TableCell key={header}>
                      {typeof response[header] === "object" ? JSON.stringify(response[header]) : response[header]}
                    </TableCell>
                  ))}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>No data available</Typography>
      )}
    </Paper>
  );
};

export default BotPage;
