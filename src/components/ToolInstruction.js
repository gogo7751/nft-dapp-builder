import React, { useState } from "react";
import {
  Button,
  Box,
  Container,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { grey } from "@mui/material/colors";
import Gap from "../components/Gap";
import Panel from "../components/Panel";
import { Label } from "../components/Label";

import NFT_tool1 from "../images/NFT_tool1.jpg";
import NFT_tool2 from "../images/NFT_tool2.jpg";
import NFT_tool3 from "../images/NFT_tool3.jpg";
import NFT_tool4 from "../images/NFT_tool4.jpg";

const useStyles = makeStyles((theme) => ({
  div: {
    marginTop: "-10px",
    width: `calc(100% - 280px)`,
    height: "68px",
    position: "fixed",
    backgroundColor: "#fff",
    zIndex: 9,
  },
  line: {
    height: "1px",
    backgroundColor: "#f0f0f0",
  },
  btn: {
    color: grey[500],
  },
  img: {
    marginTop: "10px",
    width: "80%",
  },
}));

const sxContainer = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  "& > :not(style)": {
    m: 3,
    width: 180,
    // height: 128,
  },
};

export default function ToolInstruction({ handleSetData }) {
  const classes = useStyles();
  const [alert, setAlert] = useState("");

  return (
    <Container maxWidth="md">
      <Gap height="32px" />

      <Panel top={0}>
        <Label>How to create NFT collection?</Label>

        <Typography>Step 1. Download NFT image generator</Typography>

        <Box sx={sxContainer}>
          <Paper elevation={1}>
            <Stack alignItems="center">
              <Gap height="20px" />
              <i
                className="fab fa-windows"
                style={{ fontSize: "3rem", color: "#aaa" }}
              ></i>
              <Gap height="10px" />
              <Typography className={classes.btn} variant="h6">
                Windows
              </Typography>
              <Typography className={classes.btn} variant="caption">
                Windows 64-BIT
              </Typography>
              <Gap height="10px" />
              <Button sx={{ width: "85%" }} variant="contained">
                Download
              </Button>
              <Gap height="15px" />
            </Stack>
          </Paper>

          <Paper elevation={1}>
            <Stack alignItems="center">
              <Gap height="20px" />
              <i
                className="fab fa-apple"
                style={{ fontSize: "3rem", color: "#aaa" }}
              ></i>
              <Gap height="10px" />
              <Typography className={classes.btn} variant="h6">
                Mac OS
              </Typography>
              <Typography className={classes.btn} variant="caption">
                Mac 64-BIT
              </Typography>
              <Gap height="10px" />
              <Button sx={{ width: "85%" }} variant="contained">
                Download
              </Button>
              <Gap height="15px" />
            </Stack>
          </Paper>
        </Box>

        <Gap height="20px" />

        <Typography>Step 2. Manage image layers</Typography>

        <Box display="flex" justifyContent="center">
          <img src={NFT_tool1} className={classes.img} />
        </Box>

        <Gap height="40px" />

        <Typography>Step 3. Create generative images</Typography>

        <Box display="flex" justifyContent="center">
          <img src={NFT_tool2} className={classes.img} />
        </Box>

        <Gap height="40px" />

        <Typography>Step 4. Set sale phases</Typography>

        <Box display="flex" justifyContent="center">
          <img src={NFT_tool3} className={classes.img} />
        </Box>

        <Gap height="40px" />

        <Typography>
          Step 5. Upload collection and get collection data
        </Typography>

        <Box display="flex" justifyContent="center">
          <img src={NFT_tool4} className={classes.img} />
        </Box>

        <Gap height="40px" />

        <Box display="flex">
          <Typography>Step 6. Click</Typography>

          <Button
            variant="contained"
            size="small"
            onClick={handleSetData}
            sx={{ marginLeft: 1, marginTop: -0.4, marginRight: 1 }}
          >
            set collection data
          </Button>

          <Typography>to past collection data</Typography>
        </Box>

        <Gap height="20px" />
      </Panel>
    </Container>
  );
}
