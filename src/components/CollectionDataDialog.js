import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContentText,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import Gap from "./Gap";
import AlertMessage from "./Alert";
import ProjectDataService from "../services/ProjectDataService";
import { UserContext } from "../UserContext";

const hasJSONStructure = (str) => {
  if (typeof str !== "string") return false;
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return type === "[object Object]" || type === "[object Array]";
  } catch (err) {
    return false;
  }
};

export default function CollectionDataDialog({
  openCollectionDialog,
  setOpenCollectionDialog,
}) {
  const [collectionData, setCollectionData] = useState("");
  const { project, setProject, setLoading } = useContext(UserContext);
  const [alert, setAlert] = useState("");
  const salePhaseData = useRef("");

  useEffect(() => {
    let salePhases = project?.contract?.sale_phases;
    if (salePhases !== undefined) {
      salePhases = salePhases.map((salePhase) => {
        return {
          type: salePhase?.type,
          amount: salePhase?.amount,
          legendaryAmount: salePhase?.legendaryAmount,
          imageCID: salePhase?.imageCID,
          metadataCID: salePhase?.metadataCID,
        };
      });

      const data = JSON.stringify(
        {
          salePhases: salePhases,
          mysteryBoxCID: project?.contract?.mystery_box_cid,
          mysteryBoxMetadataCID: project?.contract?.mystery_box_metadata_cid,
        },
        null,
        4
      );
      setCollectionData(data);
      salePhaseData.current = data;
    } else {
      setCollectionData("");
    }
  }, [project]);

  const handleClose = () => {
    // undo data to initial state if not updated
    setCollectionData(salePhaseData.current);
    setOpenCollectionDialog(false);
  };

  const handleUpdateData = async () => {
    if (!hasJSONStructure(collectionData)) {
      setAlert("Invalid JSON collection data");
      return;
    }

    const collectionDataJSON = JSON.parse(collectionData);
    if (
      !collectionDataJSON?.salePhases ||
      !collectionDataJSON?.salePhases[0].imageCID ||
      !collectionDataJSON?.salePhases[0].metadataCID
    ) {
      setAlert("Invalid collection data sale phases");
      return;
    }

    setLoading(true);

    const mysteryBoxCID = collectionDataJSON.mysteryBoxCID;
    const mysteryBoxMetadataCID = collectionDataJSON.mysteryBoxMetadataCID;
    const updatedSalePhases =
      project["contract"]?.sale_phases !== undefined
        ? project["contract"]?.sale_phases
        : [];

    for (let i = 0; i < collectionDataJSON.salePhases.length; i++) {
      const salePhase = {
        type: collectionDataJSON.salePhases[i].type,
        amount: collectionDataJSON.salePhases[i].amount,
        legendaryAmount: collectionDataJSON.salePhases[i].legendaryAmount,
        imageCID: collectionDataJSON.salePhases[i].imageCID,
        metadataCID: collectionDataJSON.salePhases[i].metadataCID,
      };
      if (updatedSalePhases[i] !== undefined) {
        updatedSalePhases[i] = {
          ...updatedSalePhases[i],
          ...salePhase,
        };
      } else {
        updatedSalePhases.push(salePhase);
      }
    }

    const contractData = project["contract"];
    const newProjectData = {
      ...project,
      contract: {
        ...contractData,
        sale_phases: updatedSalePhases,
        mystery_box_cid: mysteryBoxCID,
        mystery_box_metadata_cid: mysteryBoxMetadataCID,
      },
    };
    setProject(newProjectData);
    await ProjectDataService.updateProjectData(newProjectData);

    setOpenCollectionDialog(false);
    setLoading(false);
  };

  return (
    <Dialog
      open={openCollectionDialog}
      onClose={handleClose}
      maxWidth={"sm"}
      fullWidth={true}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer,
      }}
    >
      <DialogTitle>Collection Data</DialogTitle>

      <DialogContent>
        <DialogContentText display="flex" justifyContent="space-between">
          Paste collection data from NFT Asset Builder
        </DialogContentText>

        <Gap height="20px" />

        <TextField
          margin="dense"
          id="name"
          label=""
          fullWidth
          rows={8}
          multiline
          autoComplete="off"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={collectionData}
          onChange={(e) => setCollectionData(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          sx={{ marginLeft: 2, marginTop: 0, marginBottom: 2, marginRight: 2 }}
          onClick={handleUpdateData}
        >
          Update Collection Data
        </Button>
      </DialogActions>

      {/* Alert */}
      <AlertMessage alertState={{ alert, setAlert }} />
    </Dialog>
  );
}
