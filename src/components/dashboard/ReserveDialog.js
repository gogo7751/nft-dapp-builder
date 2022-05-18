import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Gap from "../Gap";

export default function ReserveDialog({
  openReserveDialog,
  setOpenReserveDialog,
  handleAction,
  tokenLeft,
  setAlert,
}) {
  const [amount, setAmount] = useState(0);

  const handleClose = () => {
    setAmount(0);
    setOpenReserveDialog(false);
  };

  const handleReserve = async () => {
    if (amount > tokenLeft) {
      setAlert("Not enough token to reserve.");
      return;
    }

    if (amount === 0) {
      setOpenReserveDialog(false);
      return;
    }

    handleAction(amount);
    setOpenReserveDialog(false);
  };

  return (
    <Dialog
      open={openReserveDialog}
      onClose={handleClose}
      maxWidth={"xs"}
      fullWidth={true}
    >
      <DialogTitle>Reserve Token</DialogTitle>

      <DialogContent>
        <Gap height="15px" />

        <TextField
          type="number"
          margin="dense"
          label={`Total Amount(0-${tokenLeft})`}
          fullWidth
          autoComplete="off"
          variant="outlined"
          InputProps={{
            inputProps: {
              max: { tokenLeft },
              min: 0,
            },
          }}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            setAmount(parseInt(e.target.value));
          }}
          value={amount}
        />

        <Gap height="15px" />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleReserve}>Reserve</Button>
      </DialogActions>
    </Dialog>
  );
}
