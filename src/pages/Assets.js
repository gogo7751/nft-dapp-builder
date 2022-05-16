import React, { useState } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Button, Box, Typography } from "@mui/material";

import { makeStyles } from "@mui/styles";
import Gap from "../components/Gap";
import CollectionData from "../components/CollectionData";
import CollectionDataDialog from "../components/CollectionDataDialog";
import ToolInstruction from "../components/ToolInstruction";

const useStyles = makeStyles((theme) => ({
  div: {
    marginTop: "-10px",
    width: `calc(100% - 280px)`,
    height: "116px",
    position: "fixed",
    backgroundColor: "#fff",
    zIndex: 999,
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`editor-tabpanel-${index}`}
      aria-labelledby={`editor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `editor-tab-${index}`,
    "aria-controls": `editor-tabpanel-${index}`,
  };
}

export default function Assets() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [openCollectionDialog, setOpenCollectionDialog] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSetData = () => {
    setOpenCollectionDialog(true);
  };

  const tabItems = [
    {
      label: "Collection Info",
      content: <CollectionData />,
    },
    {
      label: "How to create",
      content: <ToolInstruction handleSetData={handleSetData} />,
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <div className={classes.div}>
        <Gap />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4" sx={{ marginLeft: 2, marginBottom: 2 }}>
            NFT Collection
          </Typography>

          <Button
            variant="contained"
            sx={{ marginLeft: 2, marginTop: 0, marginBottom: 2 }}
            onClick={handleSetData}
          >
            set collection data
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange}>
            {tabItems.map((item, index) => (
              <Tab label={item.label} key={index} {...a11yProps({ index })} />
            ))}
          </Tabs>
        </Box>
      </div>

      <Gap height="110px" />

      {tabItems.map((item, index) => (
        <TabPanel value={value} index={index} key={index}>
          {item.content}
        </TabPanel>
      ))}

      <CollectionDataDialog
        openCollectionDialog={openCollectionDialog}
        setOpenCollectionDialog={setOpenCollectionDialog}
      />
    </Box>
  );
}
