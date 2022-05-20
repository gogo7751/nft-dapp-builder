import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

const calculateTimeLeft = (end_date) => {
  const difference = +new Date(end_date * 1000) - +new Date();

  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export default function Counter(data) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(data.endDate));

  useEffect(() => {
    const timeout = setTimeout(
      () => setTimeLeft(calculateTimeLeft(data.endDate)),
      1000
    );
    return () => {
      clearTimeout(timeout);
    };
  }, [timeLeft]);

  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="center"
      spacing={1}
      m={2}
    >
      <Grid>
        <Typography variant="h4">
          {String(timeLeft.days).padStart(2, "0")}
        </Typography>
        <Typography variant="subtitle2" align="center">
          DAY
        </Typography>
      </Grid>

      <Grid>
        <Typography variant="h4">:</Typography>
      </Grid>

      <Grid>
        <Typography variant="h4">
          {String(timeLeft.hours).padStart(2, "0")}
        </Typography>
        <Typography variant="subtitle2" align="center">
          HOUR
        </Typography>
      </Grid>

      <Grid>
        <Typography variant="h4">:</Typography>
      </Grid>

      <Grid>
        <Typography variant="h4">
          {String(timeLeft.minutes).padStart(2, "0")}
        </Typography>
        <Typography variant="subtitle2" align="center">
          MIN
        </Typography>
      </Grid>

      <Grid>
        <Typography variant="h4">:</Typography>
      </Grid>

      <Grid>
        <Typography variant="h4">
          {String(timeLeft.seconds).padStart(2, "0")}
        </Typography>
        <Typography variant="subtitle2" align="center">
          SEC
        </Typography>
      </Grid>
    </Stack>
  );
}
