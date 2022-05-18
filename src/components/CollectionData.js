import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
} from "@mui/material";
import { UserContext } from "../UserContext";
import { Label } from "../components/Label";
import Panel from "../components/Panel";
import Gap from "../components/Gap";
import CheckIcon from "@mui/icons-material/Check";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { grey } from "@mui/material/colors";

const salePhaseTableHeader = [
  "Sale Phase",
  "Image CID",
  "Metadata CID",
  "Amount",
];

const getItemDisplay = (value) => {
  return <>{value === true ? <CheckIcon fontSize="small" /> : "--"}</>;
};

export default function CollectionData() {
  const { project } = useContext(UserContext);
  const [salePhases, setSalePhases] = useState([]);
  const [projectData, setProjectData] = useState({});

  useEffect(() => {
    try {
      const data = project["contract"];
      setProjectData(data);

      const currentSalePhases = data["sale_phases"];
      setSalePhases(currentSalePhases ? [] : currentSalePhases);
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
        <TableCell align="center">
          <Link
            sx={{ marginLeft: 1, fontSize: 14 }}
            href={`https://${item.image_CID}.ipfs.nftstorage.link`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Link
          </Link>
        </TableCell>
        <TableCell align="center">
          <Link
            sx={{ marginLeft: 1, fontSize: 14 }}
            href={`https://${item.metadata_CID}.ipfs.nftstorage.link`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Link
          </Link>
        </TableCell>
        <TableCell align="center">{item.total_amount}</TableCell>
      </TableRow>
    );
  };

  const noCollectionInfo = () => {
    return (
      <Box
        display="flex"
        alignItems="center"
        flexDirection="column"
        sx={{ opacity: "0.3" }}
      >
        <AddPhotoAlternateIcon style={{ fontSize: 100, color: grey[500] }} />
        <Typography
          sx={{ fontSize: 16, color: (theme) => theme.palette.grey[600] }}
        >
          You havn't set collection data yet.
        </Typography>
      </Box>
    );
  };

  const collectionInfo = () => {
    return (
      <>
        <Label>Sale Phase Images</Label>
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

        <Label gutterTop>Mystery Box Image</Label>

        <Box display="flex">
          <Typography sx={{ marginLeft: 4, fontSize: 14 }}>
            Image CID:
          </Typography>

          {projectData.mystery_box_cid !== "" ? (
            <Link
              sx={{ marginTop: 0.5, marginLeft: 1.5, fontSize: 14 }}
              href={`https://${projectData.mystery_box_cid}.ipfs.nftstorage.link`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Link
            </Link>
          ) : (
            <Typography
              sx={{ marginLeft: 1.5, fontSize: 14, color: "#ff0f67" }}
            >
              Not Available
            </Typography>
          )}
        </Box>

        <Gap height="8px" />

        <Box display="flex">
          <Typography sx={{ marginLeft: 4, fontSize: 14 }}>
            Metadata CID:
          </Typography>

          {projectData.mystery_box_metadata_cid !== "" ? (
            <Link
              sx={{ marginTop: 0.5, marginLeft: 1.5, fontSize: 14 }}
              href={`https://${projectData.mystery_box_metadata_cid}.ipfs.nftstorage.link`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Link
            </Link>
          ) : (
            <Typography
              sx={{ marginLeft: 1.5, fontSize: 14, color: "#ff0f67" }}
            >
              Not Available
            </Typography>
          )}
        </Box>
      </>
    );
  };

  return (
    <>
      <Container maxWidth="md">
        <Panel>
          {salePhases.length === 0 ? noCollectionInfo() : collectionInfo()}
        </Panel>
      </Container>
    </>
  );
}
