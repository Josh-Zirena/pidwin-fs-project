import {
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  styled,
  TextField,
  useTheme,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import React, { useState } from "react";

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${deepPurple[500]} 30%, ${theme.palette.secondary.main} 90%)`,
  color: theme.palette.common.white,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 4),
  boxShadow: theme.shadows[6],
  textTransform: "none",
  fontWeight: 600,
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[12],
  },
}));

interface WagerFormProps {
  socketId: string | undefined;
  onBetSubmit: (amount: number, isLucky: boolean) => void;
}

export const WagerForm = ({ socketId, onBetSubmit }: WagerFormProps) => {
  const theme = useTheme();
  const [amount, setAmount] = useState("");
  const [isLucky, setIsLucky] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = Number(amount);
    if (!socketId) {
      console.error("Socket ID is not available.");
      return;
    }

    onBetSubmit(numAmount, isLucky);
  };

  return (
    <Stack component="form" spacing={3} sx={{ mt: 2 }} onSubmit={handleSubmit}>
      <TextField
        label="Your Input"
        variant="filled"
        fullWidth
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        sx={{
          background: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={isLucky}
            onChange={(e) => setIsLucky(e.target.checked)}
            sx={{
              color: deepPurple[500],
              "&.Mui-checked": { color: deepPurple[700] },
            }}
          />
        }
        label="Wager a Lucky 7?"
        sx={{ userSelect: "none" }}
      />
      <GradientButton type="submit">Submit</GradientButton>
    </Stack>
  );
};
