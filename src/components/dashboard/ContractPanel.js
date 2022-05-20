//import React, { useState, useEffect, useContext } from 'react'
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { IconButton, Box, Tooltip } from "@mui/material";
import { Label } from "../Label";
import Panel from "../Panel";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LaunchIcon from "@mui/icons-material/Launch";
import { getNetworkInfo } from "../../networks";

export default function ContractPanel({ address, networkId }) {
  const [copiedText, setCopiedText] = useState();
  const sxLabel = {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#999999",
  };

  const formatAddress =
    "0" +
    address?.substr(1, 5) +
    "..." +
    address?.substr(address?.length - 4, 4);

  const openExplorer = () => {
    const networkInfo = getNetworkInfo(networkId);
    if(networkInfo !== null) {
      const url = networkInfo.explorerURL + '/address/' + address;
      window.open(url);
    }
  }

  return (
    <>
      <Panel top={2} height={8}>
        <Label>Smart Contract</Label>

        <Box display="flex">
          <Label sx={sxLabel}>{formatAddress}</Label>

          <IconButton sx={{ marginLeft: 0.5, marginTop: -1.5 }}>
            <CopyToClipboard
              text={address}
              onCopy={() => setCopiedText(address)}
            >
              <Tooltip
                title={
                  copiedText === address
                    ? "Address Copied!"
                    : "Copy To Clipboard"
                }
                placement="top"
              >
                <ContentCopyIcon fontSize="small" />
              </Tooltip>
            </CopyToClipboard>
          </IconButton>

          <IconButton 
            sx={{ marginLeft: -0.5, marginTop: -1 }}
            onClick={() => openExplorer()}
          >
            <LaunchIcon fontSize="small" />
          </IconButton>
        </Box>
      </Panel>
    </>
  );
}
