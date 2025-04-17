import { CircularProgress, Box } from "@mui/material";

interface LoadingSpinnerProps {
  size?: number;
}

const LoadingSpinner = ({ size = 40 }: LoadingSpinnerProps) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight={200}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default LoadingSpinner;
