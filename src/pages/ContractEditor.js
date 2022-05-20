import React, { useState, useEffect, useContext } from "react";
import Web3 from "web3";
import { ethers } from "ethers";
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";
import { makeStyles } from "@mui/styles";
import {
  Button,
  Box,
  IconButton,
  Container,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { UserContext } from "../UserContext";
import { Label } from "../components/Label";
import { NetworkSelector } from "../components/Selector";
import ProjectDataService from "../services/ProjectDataService";
import ContractService from "../services/ContractService";
import Panel from "../components/Panel";
import Gap from "../components/Gap";
import TextInput from "../components/TextInput";
import SalePhaseDialog from "../components/SalePhaseDialog";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import LaunchIcon from '@mui/icons-material/Launch';
import CheckIcon from "@mui/icons-material/Check";
import AlertMessage from "../components/Alert";
import { getNetworkInfo } from "../networks";

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

const salePhaseTableHeader = [
  "Sale Phase",
  "Amount",
  "Sales Time",
  "Mint Price",
  "Mystery Box",
  "Whitelist Access",
  "Token Access",
  "",
];

const getItemDisplay = (value) => {
  return <>{value === true ? <CheckIcon fontSize="small" /> : "--"}</>;
};

export default function ContractEditor() {
  const classes = useStyles();
  const { project, setProject, setLoading } = useContext(UserContext);
  const [alert, setAlert] = useState("");
  const [salePhases, setSalePhases] = useState([]);
  const [salePhase, setSalePhase] = useState(null);
  const [salePhaseIndex, setSalePhaseIndex] = useState(0);
  const [networkId, setNetworkId] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    //console.log("initProjectData...")

    try {
      const data = project["contract"];
      setContractAddress(
        data?.contract_address === undefined ? null : data?.contract_address
      );
      //console.log("setContractAddress", data?.contract_address)

      const currentSalePhases = data["sale_phases"];
      setSalePhases(currentSalePhases === undefined ? [] : currentSalePhases);
      //console.log("currentSalePhases", currentSalePhases)
    } catch (error) {
      setSalePhases([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const getSalePhaseRow = (item, index) => {
    return (
      <TableRow
        key={index}
        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
      >
        <TableCell align="center">{item?.name}</TableCell>
        <TableCell align="center">{item?.total_amount}</TableCell>
        <TableCell align="center">
          {getSalesTimeString(item?.begin_date, item?.end_date)}
        </TableCell>
        <TableCell align="center">
          {item?.mint_price ? item?.mint_price : "--"}
        </TableCell>
        <TableCell align="center">
          {getItemDisplay(item?.mystery_box)}
        </TableCell>
        <TableCell align="center">{getItemDisplay(item?.whitelist)}</TableCell>
        <TableCell align="center">{getItemDisplay(item?.hold_token)}</TableCell>
        <TableCell>
          <IconButton
            onClick={() => {
              setSalePhaseIndex(index);
              setSalePhase(item);
              setOpenDialog(true);
            }}
          >
            {contractAddress ? (
              <MoreHorizIcon fontSize="small" />
            ) : (
              <EditIcon fontSize="small" />
            )}
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  const getSalesTimeString = (beginDate, endDate) => {
    if (beginDate && endDate) {
      return getDateString(beginDate) + " ~ " + getDateString(endDate);
    } else {
      return "--";
    }
  };

  const getDateString = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    return month + "/" + day;
  };

  const getContractAddress = () => {
    return (
      "0" +
      contractAddress?.substr(1, 5) +
      "..." +
      contractAddress?.substr(contractAddress?.length - 4, 4)
    );
  };

  const handleSalePhaseDialogAction = (updatedSalePhase) => {
    const index = salePhases.indexOf(salePhase);
    const updatedSalePhases = [...salePhases];

    const oldPhaseData = salePhases[index];
    updatedSalePhases[index] = { ...oldPhaseData, ...updatedSalePhase };
    setSalePhases(updatedSalePhases);

    // save sale phase data
    // console.log("save contract sale phases data", updatedSalePhases)
    const data = project["contract"];
    const newProjectData = {
      ...project,
      contract: { ...data, sale_phases: updatedSalePhases },
    };
    setProject(newProjectData);
    ProjectDataService.updateProjectData(newProjectData);
  };

  const getContractType = (isWhitelist, isMysteryBox, isHoldToken) => {
    if (isWhitelist && isMysteryBox && isHoldToken) {
      return 0;
    } else if (isWhitelist && isMysteryBox) {
      return 1;
    } else if (isWhitelist && isHoldToken) {
      return 2;
    } else if (isMysteryBox && isHoldToken) {
      return 3;
    } else if (isWhitelist) {
      return 4;
    } else if (isMysteryBox) {
      return 5;
    } else if (isHoldToken) {
      return 6;
    } else {
      return 7;
    }
  };

  const getMerkleRoots = (salePhases) => {
    // const merkleTreeRoots = [];
    // const whitelist = [
    //   "0xE7f72791D25ec97a94ccD0D32Aa5Ef1D9E7d83dE",
    //   "0xb41212A9Ae065128f59217Ad4B39E6e626AC2A57",
    //   "0x11aE5C23827a65845746d354e75F8fc0c1235518",
    //   "0x043D0FE28915604ecdD8B706C14BEB969B32D62a",
    // ];
    // for (let i = 0; i < salePhases.length; i++) {
    //   if (salePhases[i]["whitelist"] === true) {
    //     const leafNodes = whitelist.map((addr) => keccak256(addr));
    //     const tree = new MerkleTree(leafNodes, keccak256, {
    //       sortPairs: true,
    //     });
    //     const root = "0x" + tree.getRoot().toString("hex");
    //     merkleTreeRoots.push(root);
    //   } else {
    //     merkleTreeRoots.push(
    //       "0x0000000000000000000000000000000000000000000000000000000000000000"
    //     );
    //   }
    // }

    const merkleTreeRoots = [];
    for (let i = 0; i < salePhases.length; i++) {
      merkleTreeRoots.push(
        "0x0000000000000000000000000000000000000000000000000000000000000000"
      );
    }
    return merkleTreeRoots;
  };

  const getTokenAddresses = (salePhases) => {
    const holdTokenAddresses = [];
    for (let i = 0; i < salePhases.length; i++) {
      if (salePhases[i]["hold_token"] === true) {
        holdTokenAddresses.push(salePhases[i]["hold_token_contract"]);
      } else {
        holdTokenAddresses.push("0x0000000000000000000000000000000000000000");
      }
    }
    return holdTokenAddresses;
  };

  const getSupplyStartIndex = (salePhases, supplyAmount) => {
    const supplyStartIndex = [];
    let index = 0;
    while (index < salePhases.length) {
      if (index === 0) {
        supplyStartIndex.push(1);
      } else {
        supplyStartIndex.push(
          supplyStartIndex[index - 1] + supplyAmount[index - 1]
        );
      }
      index++;
    }
    return supplyStartIndex;
  };

  const getSaleStartTime = (salePhases) => {
    const saleStartTime = [];
    for (let i = 0; i < salePhases.length; i++) {
      saleStartTime.push(salePhases[i]["begin_date"]);
    }
    return saleStartTime;
  };

  const getContractParams = () => {
    const tokenName = project["contract"]["token_name"];
    const tokenSymbol = project["contract"]["token_symbol"];
    const maxQuantityPerMint = project["contract"]["max_quantity"];
    const salePhases = project["contract"]["sale_phases"];
    // const saleStartTime = project['contract']['sale_time'];
    const price = [];
    const supplyAmount = [];
    const mysteryBoxes = [];
    const baseURIs = [];

    let merkleTreeRoots = [];
    let holdTokenAddresses = [];
    let isWhitelist = false;
    let isMysteryBox = false;
    let isHoldToken = false;

    for (let i = 0; i < salePhases.length; i++) {
      price.push(ethers.utils.parseEther(salePhases[i]["mint_price"]));
      supplyAmount.push(salePhases[i]["total_amount"]);
      mysteryBoxes.push(salePhases[i]["mystery_box"]);
      baseURIs.push(`ipfs://${salePhases[i]["metadata_CID"]}/`);

      isMysteryBox = isMysteryBox || salePhases[i]["mystery_box"];
      isWhitelist = isWhitelist || salePhases[i]["whitelist"];
      isHoldToken = isHoldToken || salePhases[i]["hold_token"];
    }

    const contractType = getContractType(
      isWhitelist,
      isMysteryBox,
      isHoldToken
    );

    // ===== TODO:
    // REMOVE DUMMY WHITELIST, MYSTERYBOX BASE URI, HOLD TOKEN VALUES IN ELSE CONDITION WHEN 8 CONTRACT JSONs ARE CREATED =====

    // if (isWhitelist) {
    //   merkleTreeRoots = getMerkleRoots(salePhases);
    // }
    merkleTreeRoots = getMerkleRoots(salePhases);

    if (isMysteryBox) {
      const mysteryBoxMetadataCID =
        project["contract"]["mystery_box_metadata_cid"];
      if (!mysteryBoxMetadataCID) {
        setAlert(
          "Mystery box metadata not uploaded. Please select mystery box image in NFT Asset Generator."
        );
        return;
      }

      baseURIs.push(`ipfs://${mysteryBoxMetadataCID}`);
    } else {
      baseURIs.push(
        `ipfs://bafkreiefnzzhqm3udsbf54bh3epxyx7koans3lxzrj2crsdiyokl36a53a`
      );
    }

    if (isHoldToken) {
      holdTokenAddresses = getTokenAddresses(salePhases);
    } else {
      for (let i = 0; i < salePhases.length; i++) {
        holdTokenAddresses.push("0x0000000000000000000000000000000000000000");
      }
    }

    const supplyStartIndex = getSupplyStartIndex(salePhases, supplyAmount);

    const saleStartTime = getSaleStartTime(salePhases);

    return [
      contractType,
      tokenName,
      tokenSymbol,
      supplyAmount,
      supplyStartIndex,
      saleStartTime,
      price,
      maxQuantityPerMint,
      mysteryBoxes,
      baseURIs,
      merkleTreeRoots,
      holdTokenAddresses,
    ];
  };

  const deployContract = async () => {
    const isConnectedNetworkMatch =
      await contractService.isConnectedNetworkMatch(networkId);
    if (!isConnectedNetworkMatch) {
      setAlert(
        "Connected network is not the selected network. Please change your connected network."
      );
      return;
    }

    setLoading(true);

    const contractParams = getContractParams();
    const contractAddress = await contractService.deployContract(
      contractParams,
      (error) => {
        setAlert(error.message);
        return;
      }
    );

    if (contractAddress !== undefined) {
      const data = project["contract"];
      const newProjectData = {
        ...project,
        contract: {
          ...data,
          contract_address: contractAddress,
          contract_type: contractParams[0],
        },
      };
      setContractAddress(contractAddress);
      setProject(newProjectData);
      ProjectDataService.updateProjectData(newProjectData);
      // console.log("CONTRACT ADDRESS: ", contractAddress);
    }

    setLoading(false);
  };

  const openExplorer = () => {
    const networkInfo = getNetworkInfo(networkId);
    if(networkInfo !== null) {
      const url = networkInfo.explorerURL + '/address/' + contractAddress;
      window.open(url);
    }
  }

  return (
    <>
      <div className={classes.div}>
        <Gap />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4" sx={{ marginLeft: 2, marginBottom: 2 }}>
            Smart Contract
          </Typography>
          {
            contractAddress ?
            <Button
              variant="contained"
              sx={{ height: "40px" }}
              startIcon={<LaunchIcon />}
              onClick={() => openExplorer()}
            >
              { getContractAddress() }
            </Button> :
            <Button
              variant="contained"
              sx={{ height: "40px" }}
              startIcon={<RocketLaunchIcon />}
              onClick={() => deployContract()}
            >
              Deploy Contract
            </Button>                        
          }
        </Box>
        <div className={classes.line}></div>
      </div>

      <Gap height="70px" />

      <Container maxWidth="lg" sx={{ width: 980 }}>
        <Panel>
          <Label gutterBottom>Contract Settings</Label>

          <NetworkSelector
            value={networkId}
            setValue={setNetworkId}
            field="contract"
            subField="network"
            disabled={contractAddress !== null}
            gutterBottom
          />

          <TextInput
            label="Token name"
            placeholder="Enter token name"
            field="contract"
            subField="token_name"
            disabled={contractAddress !== null}
            gutterBottom
          />

          <TextInput
            label="Token symbol"
            placeholder="Enter token symbol"
            field="contract"
            subField="token_symbol"
            disabled={contractAddress !== null}
            gutterBottom
          />

          <Divider />

          <Label gutterTop>Sale Settings</Label>

          <TextInput
            label="Max quantity per mint"
            placeholder="Enter max quantity per mint"
            field="contract"
            subField="max_quantity"
            disabled={contractAddress !== null}
            gutterBottom
          />

          {salePhases.length === 0 ? (
            <></>
          ) : (
            <TableContainer component={Box}>
              <Table aria-label="phase table">
                <TableHead>
                  <TableRow>
                    {salePhaseTableHeader.map((header, index) => (
                      <TableCell key={index} align="center">
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {salePhases.map((phaseItem, index) =>
                    getSalePhaseRow(phaseItem, index)
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Panel>

        <SalePhaseDialog
          salePhase={salePhase}
          salePhaseIndex={salePhaseIndex}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          handleAction={handleSalePhaseDialogAction}
          editable={contractAddress === null}
        />

        {/* Alert */}
        <AlertMessage alertState={{ alert, setAlert }} />
      </Container>
    </>
  );
}
