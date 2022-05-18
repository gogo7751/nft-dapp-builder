import React, { useState, useEffect, useContext, useRef } from "react";
import { Container, Box, Divider, Typography, Button } from "@mui/material";
import { UserContext } from "../../UserContext";
import { Label } from "../Label";
import ProjectDataService from "../../services/ProjectDataService";
import Panel from "../Panel";
import TextInput from "../TextInput";
import Switch from "../Switch";
import AddIcon from "@mui/icons-material/Add";
import ItemList from "../List";
import TeamMemberDialog from "../TeamMemberDialog";

export default function TeamInfo() {
  const { project, setProject, setLoading } = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState(null);
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [actionLabel, setActionLabel] = useState("");
  const initProjectData = useRef(false);
  const initItemData = useRef(false);

  useEffect(() => {
    // load items from project data at first time
    if (initProjectData.current === false) {
      initProjectData.current = true;
      //console.log("Team initProjectData...")

      try {
        const data = project["team_section"];
        const currentItems = data["items"];
        setItems(currentItems === undefined ? [] : currentItems);
        //console.log("currentItems", currentItems)
      } catch (error) {
        setItems([]);
      }
    } else {
      // ignore items update at first time (prevent project data sync)
      if (initItemData.current === false) {
        initItemData.current = true;
        //console.log("Team initItemData...")
      } else {
        // sync project data
        const data = project["team_section"];
        const newProjectData = {
          ...project,
          team_section: { ...data, items: items },
          updatedDate: Math.round(new Date().getTime() / 1000),
        };
        setProject(newProjectData);
        ProjectDataService.updateProjectData(newProjectData);
        //console.log("save team items", items)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleItemAction = (newItem) => {
    var index = items.indexOf(item);
    const newItems = [...items];

    if (index !== -1) {
      newItems[index] = newItem;
    } else {
      newItems.push(newItem);
    }

    setItems(newItems);
  };

  const handleItemDelete = (item) => {
    const newItems = items.filter((el) => el.id !== item.id);
    setItems(newItems);
  };

  const handleItemEdit = (item) => {
    setItem(item);
    setActionLabel("Update");
    setDialogTitle("Edit Member");
    setOpenItemDialog(true);
  };

  const handleItemChangeOrder = (newItems) => {
    setItems(newItems);
  };

  const handleBtnAdd = () => {
    setItem({});
    setActionLabel("Add");
    setDialogTitle("Add new member");
    setOpenItemDialog(true);
  };

  return (
    <Container maxWidth="md">
      <Panel>
        <Box display="flex" justifyContent="space-between">
          <Label gutterBottom>Team Section</Label>

          <Switch
            label="Show section"
            field="team_section"
            subField="display"
          />
        </Box>

        {/* Title */}
        <TextInput
          label="Title"
          placeholder="Enter title"
          field="team_section"
          subField="title"
          gutterBottom
        />

        {/* Subtitle */}
        <TextInput
          label="Subtitle"
          placeholder="Enter subtitle"
          field="team_section"
          subField="subtitle"
          gutterBottom
        />

        <Divider />

        {/* Team Member */}
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{ paddingLeft: 2, paddingTop: 3, paddingRight: 3 }}
        >
          <Typography style={{ fontWeight: 800 }}>Team Members</Typography>

          <Button onClick={handleBtnAdd} endIcon={<AddIcon />}>
            Add Member
          </Button>
        </Box>

        <ItemList
          items={items}
          handleItemDelete={handleItemDelete}
          handleItemEdit={handleItemEdit}
          handleItemChangeOrder={handleItemChangeOrder}
        />
      </Panel>

      {/* Add Item Dialog */}
      <TeamMemberDialog
        item={item}
        dialogTitle={dialogTitle}
        actionLabel={actionLabel}
        openItemDialog={openItemDialog}
        setOpenItemDialog={setOpenItemDialog}
        setLoading={setLoading}
        handleAction={handleItemAction}
      />
    </Container>
  );
}
