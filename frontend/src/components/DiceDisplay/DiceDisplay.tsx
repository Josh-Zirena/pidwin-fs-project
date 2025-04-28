import { Box, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import DiceRoller, { ReactDiceRef } from "react-dice-complete";
import { deepPurple } from "@mui/material/colors";

interface DiceDisplayProps {
  latestRoll: { d1: number; d2: number } | null;
  onDiceRoll: (d1: number, d2: number) => void;
}

export const DiceDisplay = ({ latestRoll, onDiceRoll }: DiceDisplayProps) => {
  const theme = useTheme();

  const [displayDie1, setDisplayDie1] = useState(0);
  const [displayDie2, setDisplayDie2] = useState(0);
  const initialCaptured = useRef(false);
  const diceRef = useRef<ReactDiceRef>(null);

  useEffect(() => {
    if (!latestRoll) return;

    const { d1, d2 } = latestRoll;
    setDisplayDie1(d1);
    setDisplayDie2(d2);
    initialCaptured.current = true;
    diceRef.current?.rollAll([d1, d2]);

    onDiceRoll(d1, d2);
  }, [latestRoll, onDiceRoll]);

  console.log({ displayDie1, displayDie2 });

  return (
    <>
      {!initialCaptured.current ? (
        <Typography align="center" sx={{ mt: 5, fontWeight: 500 }}>
          Rolling...
        </Typography>
      ) : (
        <Typography align="center" sx={{ mt: 5, fontWeight: 500 }}>
          Rolled: {displayDie1} & {displayDie2}
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          mt: 2,
        }}
      >
        <DiceRoller
          numDice={2}
          disableIndividual
          dieSize={72}
          faceColor={deepPurple[500]}
          dotColor={theme.palette.common.white}
          ref={diceRef}
          rollDone={(_t, values) => {
            setDisplayDie1(values[0]);
            setDisplayDie2(values[1]);
          }}
        />
      </Box>
    </>
  );
};
