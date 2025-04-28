import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Container,
  Grow,
  Typography,
  styled,
  Card,
  CardContent,
  Box,
  List,
} from "@mui/material";
import useDiceSocket from "../../hooks/useDiceSocket";
import { WagerForm } from "../WagerForm/WagerForm";
import { DiceDisplay } from "../DiceDisplay/DiceDisplay";
import { AttachMoney } from "@mui/icons-material";
import { useUser, Profile } from "../../contexts/UserContext";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  overflow: "visible",
}));

const Layout = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: theme.spacing(4),
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: 300,
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  boxShadow: `0 8px 20px rgba(0,0,0,0.08)`,
  height: "100%",
  overflowY: "auto",
}));

const WinEntry = styled(Box)(({ theme }) => ({
  background: theme.palette.success.light,
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
}));

const LoseEntry = styled(Box)(({ theme }) => ({
  background: theme.palette.error.light,
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
}));

const NeutralEntry = styled(Box)(({ theme }) => ({
  background: theme.palette.grey[200],
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
}));

const Home: React.FC = () => {
  const { profile, setProfile } = useUser();
  if (!profile) {
    return <Typography>Login to Play</Typography>;
  }
  const { token } = profile;

  if (!token) return <Typography>Login to Play</Typography>;
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [currentBet, setCurrentBet] = useState<{
    amount: number;
    isLucky: boolean;
  } | null>(null);
  const [diceValues, setDiceValues] = useState<{ d1: number; d2: number }>({
    d1: 1,
    d2: 1,
  });
  const isFirstRoll = useRef(true);

  const { socketClient, latestRoll } = useDiceSocket("http://localhost:5000");
  const socketId = socketClient?.id;

  useEffect(() => {
    if (!latestRoll) return;
    const { d1, d2 } = latestRoll;

    if (isFirstRoll.current) {
      setHistory((prev) =>
        [
          { d1, d2, betPlaced: false, win: false, payout: undefined },
          ...prev,
        ].slice(0, 7)
      );
      isFirstRoll.current = false;
      return;
    }

    if (!currentBet) {
      setHistory((prev) =>
        [
          { d1, d2, betPlaced: false, win: false, payout: undefined },
          ...prev,
        ].slice(0, 5)
      );
    }
  }, [latestRoll]);

  const handleDiceRoll = useCallback((d1: number, d2: number) => {
    setDiceValues({ d1, d2 });
  }, []);

  const handleBetSubmit = (amount: number, isLucky: boolean) => {
    setCurrentBet({ amount, isLucky });
    rollDice(diceValues.d1, diceValues.d2, amount, isLucky);
  };

  const rollDice = async (
    d1: number,
    d2: number,
    amount: number,
    isLucky: boolean
  ) => {
    if (!socketId) {
      console.error("Socket not connected, cannot place wager");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/wager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          socketId,
          amount,
          isLucky,
          d1,
          d2,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Wager failed:", err.message || res.statusText);
        return;
      }

      const data = await res.json();
      handleResult(data, amount, isLucky);
    } catch (err) {
      console.error("Wager request failed", err);
    }
  };

  const handleResult = (newResult: any, amount: number, isLucky: boolean) => {
    const { d1, d2 } = newResult.dice;
    const betPlaced = amount > 0;

    const entry = {
      d1,
      d2,
      betPlaced,
      win: newResult.win,
      payout: newResult.win ? newResult.payout : undefined,
    };

    setResult(newResult);
    setHistory((prev) => {
      const updated = [entry, ...prev];
      return updated.slice(0, 5);
    });

    setCurrentBet(null);

    if (typeof newResult.newBalance === "number") {
      if (profile) {
        const updated: Profile = {
          ...profile,
          balance: newResult.newBalance,
          winStreak: newResult.winStreak,
        };
        localStorage.setItem("profile", JSON.stringify(updated));
        setProfile(updated);
      }
    }
  };

  return (
    <>
      <Grow in>
        <Layout sx={{ mt: 8 }}>
          <Container maxWidth="sm">
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  align="center"
                  gutterBottom
                  sx={{ fontWeight: 700 }}
                >
                  Welcome to Lucky 7!
                </Typography>

                <DiceDisplay
                  latestRoll={latestRoll}
                  onDiceRoll={handleDiceRoll}
                />

                <WagerForm socketId={socketId} onBetSubmit={handleBetSubmit} />
              </CardContent>
            </StyledCard>

            <Box textAlign="center" sx={{ mt: 4 }}>
              <Button
                component={Link}
                to="/leaders"
                variant="outlined"
                size="large"
              >
                View Top 10 Luckiest Players
              </Button>
            </Box>
          </Container>

          <Sidebar>
            <Typography variant="h6" gutterBottom align="center">
              Last 5 Results
            </Typography>
            <List disablePadding>
              {history.map((entry, index) => {
                let CardWrapper;
                if (!entry.betPlaced) {
                  CardWrapper = NeutralEntry;
                } else {
                  CardWrapper = entry.win ? WinEntry : LoseEntry;
                }
                return (
                  <CardWrapper key={index}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      {!entry.betPlaced ? (
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          You could’ve won!
                        </Typography>
                      ) : entry.win ? (
                        <>
                          <AttachMoney fontSize="small" />
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600 }}
                          >
                            You Won ${entry.payout}
                          </Typography>
                        </>
                      ) : (
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600 }}
                        >
                          You Lost
                        </Typography>
                      )}
                    </Box>

                    <Typography
                      variant="caption"
                      sx={{ display: "block", opacity: 0.7 }}
                    >
                      Dice Rolled: {entry.d1} &amp; {entry.d2}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", opacity: 0.7 }}
                    >
                      Bet Placed: {entry.betPlaced ? "Yes" : "No"}
                    </Typography>
                  </CardWrapper>
                );
              })}
            </List>
          </Sidebar>
        </Layout>
      </Grow>
    </>
  );
};

export default Home;
