import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { ethers } from "ethers";
import AlertMessage from "../Alert";

const isValidContractAddress = (address) => {
  try {
    // Will trigger error if address not valid
    ethers.utils.getAddress(address);
    return true;
  } catch {
    return false;
  }
};

export default function WhitelistDialog({
  salePhase,
  openDialog,
  setOpenDialog,
  whitelist,
  setWhitelist,
  handleAction,
}) {
  const [alert, setAlert] = useState("");
  const [invalidAddress, setInvalidAddress] = useState(null);
  const orgWhitelist = useRef("");

  useEffect(() => {
    if (openDialog) {
      orgWhitelist.current = whitelist;
    }
  }, [openDialog]);

  const handleSave = () => {
    const addresses = whitelist.split("\n");
    let whitelistAddresses = [];
    let currentWhitelist = "";

    // 1. check and highlight invalid addresses
    // 2. remove repeat addresses
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      if (address === "" || whitelistAddresses.includes(address)) {
        continue;
      }

      if (isValidContractAddress(address) === false) {
        setInvalidAddress(address);
        setAlert("Invalid address: " + address);
        return;
      }

      whitelistAddresses.push(address);
      currentWhitelist += address + "\n";
    }

    setOpenDialog(false);
    handleAction(
      currentWhitelist,
      orgWhitelist.current !== whitelist,
      whitelistAddresses.length
    );
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleFocus = (event) => {
    if (invalidAddress === null) {
      return;
    }

    event.preventDefault();
    const { target } = event;
    const position = whitelist.search(invalidAddress);
    target.focus();
    target.setSelectionRange(position, position + invalidAddress.length);
  };

  return (
    <Dialog
      maxWidth={"sm"}
      fullWidth={true}
      open={openDialog}
      onClose={handleClose}
    >
      <DialogTitle>Edit Whitelist ({salePhase?.name})</DialogTitle>

      <DialogContent>
        <TextField
          margin="dense"
          id="name"
          label="Enter whitelist addresses"
          autoFocus
          fullWidth
          multiline
          maxRows={20}
          autoComplete="off"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          inputProps={{ spellCheck: false }}
          onChange={(e) => {
            if (salePhase?.completed === false) setWhitelist(e.target.value);
          }}
          size="small"
          onFocus={handleFocus}
          inputRef={(input) => invalidAddress && input && input.focus()}
          value={whitelist}
        />
      </DialogContent>

      <DialogActions>
        {salePhase?.completed ? (
          <Button onClick={handleClose}>Close</Button>
        ) : (
          <>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </>
        )}
      </DialogActions>

      {/* Alert */}
      <AlertMessage alertState={{ alert, setAlert }} />
    </Dialog>
  );
}
