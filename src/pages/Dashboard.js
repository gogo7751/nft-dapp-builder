import React, { useState, useEffect, useContext } from "react";
import { Grid, Button, Box, Container, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import DownloadIcon from "@mui/icons-material/Download";

import Gap from "../components/Gap";
import AlertMessage from "../components/Alert";
import AssetsPanel from "../components/dashboard/AssetsPanel";
import ContractPanel from "../components/dashboard/ContractPanel";
import WebsitePanel from "../components/dashboard/WebsitePanel";
import SalesPanel from "../components/dashboard/SalesPanel";
import { Label } from "../components/Label";
import ContractService from "../services/ContractService";
import { UserContext } from "../UserContext";

const contractService = new ContractService();

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
}));

export default function Dashboard() {
  const classes = useStyles();
  const [alert, setAlert] = useState("");
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [totalNFTCollection, setTotalNFTCollection] = useState(0);
  const [mintedToken, setMintedToken] = useState([]);
  const { project, setProject, setLoading } = useContext(UserContext);

  const errorHandler = (err) => {
    setAlert(err.message);
  };

  const calculateTokenStartIndex = (
    phaseIndex,
    phaseTokenStartIndex,
    salePhase
  ) => {
    if (phaseIndex === 0) {
      return 0;
    }
    return phaseTokenStartIndex[phaseIndex - 1] + salePhase.totalAmount;
  };

  const calculatePhaseTokenSold = async (
    phaseIndex,
    salePhase,
    phaseTokenStartIndex,
    currentPhaseIndex
  ) => {
    let tokenSold;
    if (phaseIndex > currentPhaseIndex) {
      return 0;
    }

    if (salePhase.completed) {
      tokenSold = await contractService.getPhaseTokenSold(
        phaseIndex,
        errorHandler
      );
    } else {
      const nowTokenId = await contractService.getNowTokenId(errorHandler);
      tokenSold = nowTokenId - phaseTokenStartIndex;
    }
    return tokenSold;
  };

  useEffect(() => {
    try {
      (async () => {
        if (project !== null) {
          setLoading(true);

          const data = project["contract"];
          const contractAddress = data?.contract_address;
          const contractType = data?.contract_type;
          const currentSalePhaseIndex = data?.current_sale_phase;
          const salePhases = data?.sale_phases;

          if (contractAddress || contractType) {
            contractService.setAddress(contractAddress);
            contractService.setContractType(contractType);
            const contractBalance = await contractService.getContractBalance(
              errorHandler
            );
            setBalance(contractBalance);
            setAddress(contractAddress);
          } else {
            setBalance(0);
            setAddress("");
          }

          if (salePhases) {
            let totalAmount = 0;
            const phaseTokenStartIndex = [];
            const mintedToken = [];

            for (let i = 0; i < salePhases.length; i++) {
              const tokenStartIndex = calculateTokenStartIndex(
                i,
                phaseTokenStartIndex,
                salePhases[i]
              );
              phaseTokenStartIndex.push(tokenStartIndex);
              const tokenSold = await calculatePhaseTokenSold(
                i,
                salePhases[i],
                phaseTokenStartIndex[i],
                currentSalePhaseIndex
              );

              mintedToken.push(`${tokenSold}`);
              totalAmount += salePhases[i].total_amount;
            }

            setMintedToken(mintedToken);
            setTotalNFTCollection(totalAmount);

            setLoading(false);
          } else {
            setLoading(false);
            setMintedToken([]);
            setTotalNFTCollection(0);
          }
        }
      })();
    } catch (err) {
      setLoading(false);
      setBalance(0);
      setAddress("");
      setMintedToken([]);
      setTotalNFTCollection(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const setContractSaleStartTime = async (timestamp, phaseIndex) => {
    await contractService.setSaleStartTime(timestamp, phaseIndex, errorHandler);
  };

  const setContractMerkleRoot = async (merkleRoot, phaseIndex) => {
    await contractService.setMerkleRoot(merkleRoot, phaseIndex, errorHandler);
  };

  const withdrawContractBalance = async () => {
    await contractService.withdrawBalance(errorHandler);
  };

  const flipContractIsSaleActive = async () => {
    await contractService.flipIsSaleActive(errorHandler);
  };

  const flipContractToNextPhase = async () => {
    await contractService.flipToNextPhase(errorHandler);
  };

  const flipContractMysteryBoxState = async (phaseIndex) => {
    const metadataCID = project.contract.sale_phases[phaseIndex].metadata_CID;
    const baseURI = `ipfs://${metadataCID}`;

    await contractService.flipMysteryBoxState(
      phaseIndex,
      baseURI,
      errorHandler
    );
  };

  const reserveContractToken = async (phaseIndex, numOfReserveToken) => {
    setLoading(true);

    await contractService.reserveToken(
      phaseIndex,
      numOfReserveToken,
      errorHandler
    );

    setLoading(false);
  };

  return (
    <>
      <div className={classes.div}>
        <Gap />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4" sx={{ marginLeft: 2, marginBottom: 2 }}>
            Dashboard
          </Typography>

          <Box
            display="flex"
            bgcolor="info.main"
            sx={{ marginRight: 0, marginTop: 2.0 }}
          >
            <Label>Balance: {balance} ETH</Label>

            <Button
              variant="outlined"
              endIcon={<DownloadIcon />}
              sx={{ marginLeft: 2, marginTop: -1.35, marginBottom: 2 }}
              onClick={() => withdrawContractBalance()}
            >
              Withdraw
            </Button>
          </Box>
        </Box>
        <div className={classes.line}></div>
      </div>

      <Gap height="70px" />

      <Container maxWidth="md">
        <Grid container spacing={3}>
          {/* Assets */}
          <Grid item md={4} xs={12} sm={12}>
            <AssetsPanel totalNFTCollection={totalNFTCollection} />
          </Grid>

          {/* Website */}
          <Grid item md={4} xs={12} sm={6}>
            <WebsitePanel />
          </Grid>

          {/* Smart Contract */}
          <Grid item md={4} xs={12} sm={6}>
            <ContractPanel address={address} />
          </Grid>
        </Grid>

        <SalesPanel
          mintedToken={mintedToken}
          setContractSaleStartTime={setContractSaleStartTime}
          setContractMerkleRoot={setContractMerkleRoot}
          flipContractMysteryBoxState={flipContractMysteryBoxState}
          reserveContractToken={reserveContractToken}
        />

        {/* Alert */}
        <AlertMessage alertState={{ alert, setAlert }} />
      </Container>
    </>
  );
}
