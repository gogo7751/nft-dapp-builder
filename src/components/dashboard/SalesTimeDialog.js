import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";
import AlertMessage from "../Alert";
import Gap from "../Gap";

export default function SalesTimeDialog({
  salePhase,
  openDialog,
  setOpenDialog,
  handleAction,
}) {
  const [beginDate, setBeginDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    setBeginDate(salePhase?.begin_date);
    setEndDate(salePhase?.end_date);
  }, [salePhase]);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleUpdate = async () => {
    handleAction(beginDate, endDate);
    setOpenDialog(false);
  };

  return (
    <Dialog open={openDialog} onClose={handleClose}>
      <DialogTitle>Edit Sales Time (Local)</DialogTitle>

      <DialogContent>
        <Gap height="10px" />

        <Box display="flex">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Begin Date"
              value={new Date(beginDate * 1000)}
              onChange={(date) => {
                date.setSeconds(0);
                setBeginDate(Math.round(date.getTime() / 1000));
              }}
              renderInput={(params) => <TextField {...params} />}
            />

            <Gap width="20px" />

            <DateTimePicker
              label="End Date"
              value={new Date(endDate * 1000)}
              onChange={(date) => {
                date.setSeconds(0);
                setEndDate(Math.round(date.getTime() / 1000));
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>

        <Gap height="10px" />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleUpdate}>Ok</Button>
      </DialogActions>

      {/* Alert */}
      <AlertMessage alertState={{ alert, setAlert }} />
    </Dialog>
  );
}
