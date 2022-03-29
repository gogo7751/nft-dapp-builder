import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Box, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

import ProjectInfo from "../components/editor/ProjectInfo";
import MintInfo from "../components/editor/MintInfo";
import AboutInfo from "../components/editor/AboutInfo";
import RoadmapInfo from "../components/editor/RoadmapInfo";
import TeamInfo from "../components/editor/TeamInfo";
import FaqInfo from "../components/editor/FaqInfo";
import Gap from "../components/Gap";
import WebsiteDataService from "../services/WebsiteDataService";
import { UserContext } from "../UserContext";

const useStyles = makeStyles((theme) => ({
  div: {
    marginTop: "-10px",
    width: `calc(100% - 280px)`,
    height: "118px",
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

export default function WebsiteEditor() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const { user, project } = useContext(UserContext);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSync = () => {
    if (project.website.link) {
      WebsiteDataService.syncData(
        project.website.link,
        user.address,
        project.project_id
      );
    }
  };

  const tabItems = [
    {
      label: "project",
      content: <ProjectInfo />,
    },
    {
      label: "mint",
      content: <MintInfo />,
    },
    {
      label: "about",
      content: <AboutInfo />,
    },
    {
      label: "roadmap",
      content: <RoadmapInfo />,
    },
    {
      label: "team",
      content: <TeamInfo />,
    },
    {
      label: "faq",
      content: <FaqInfo />,
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <div className={classes.div}>
        <Gap />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4" sx={{ marginLeft: 2, marginBottom: 2 }}>
            Website
          </Typography>

          {project && project.website.link && (
            <Button
              variant="outlined"
              sx={{ marginLeft: 2, marginTop: 0, marginBottom: 2 }}
              onClick={() => {
                handleSync();
              }}
            >
              Sync
            </Button>
          )}
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
    </Box>
  );
}
