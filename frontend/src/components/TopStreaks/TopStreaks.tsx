import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  Paper,
} from "@mui/material";

interface Leader {
  name: string;
  winStreak: number;
}

const TopStreaks: React.FC = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/leaders");
        console.log({ res });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        console.log({ data });
        setLeaders(data.leaders);
      } catch (err: any) {
        setError(err.message || "Failed to fetch leaders");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 8 }}>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  const fullList: Leader[] = [
    ...leaders,
    ...Array.from({ length: 10 - leaders.length }, () => ({
      name: "-",
      winStreak: 0,
    })),
  ].slice(0, 10);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Top 10 Luckiest Players
        </Typography>

        <List>
          {fullList.map((leader, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={`${index + 1}. ${leader.name}`}
                secondary={`Winning Streak: ${leader.winStreak}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default TopStreaks;
