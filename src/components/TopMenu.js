import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  AppBar,
  Toolbar,
  Avatar,
  Box,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fade,
} from '@mui/material';
import { UserContext } from '../UserContext';

import ProjectDataService from '../services/ProjectDataService';
import UserDataService from '../services/UserDataService';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';

import ProjectDialog from './ProjectDialog';
import UserMenu from './UserMenu';

const drawerWidth = 220;

const sxAppBar = {
  width: `calc(100% - ${drawerWidth}px)`,
  //backgroundColor: 'grey.50',
  backgroundColor: '#fff',
  color: 'text.secondary',
  marginLeft: drawerWidth,
};

const TopMenu = () => {
  const history = useHistory();

  const { user, setUser, setLoading, setProject } = useContext(UserContext);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [anchorProjects, setAnchorProjects] = useState(null);
  const [userMenu, setUserMenu] = useState(null);
  const openProjects = Boolean(anchorProjects);

  const btnAccount = () => {
    const address = user?.address;
    const formatAddress =
      '0' +
      address?.substr(1, 5) +
      '...' +
      address?.substr(address?.length - 4, 4);
    return (
      <Button
        color="inherit"
        size="large"
        startIcon={
          <Avatar
            alt=""
            sx={{ width: 20, height: 20, bgcolor: 'primary.main' }}
          />
        }
        sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 800 }}
        onClick={(e) => {
          setUserMenu(e.currentTarget);
        }}
      >
        {formatAddress}
      </Button>
    );
  };

  const btnProjectList = () => {
    const projects = user?.projects;
    return (
      <Button
        color="inherit"
        size="large"
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ textTransform: 'none' }}
        onClick={(e) => {
          setAnchorProjects(e.currentTarget);
        }}
      >
        {projects[0].name}
      </Button>
    );
  };

  const menuProjectList = () => {
    const projects = user?.projects;
    return (
      <Menu
        anchorEl={anchorProjects}
        open={openProjects}
        onClose={() => {
          setAnchorProjects(null);
        }}
        TransitionComponent={Fade}
      >
        {projects.map((project, index) => (
          <MenuItem
            key={index}
            sx={{ color: 'text.secondary' }}
            onClick={() => handleSelectProject(project.project_id)}
          >
            <ListItemText>{project.name}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          sx={{ color: 'text.secondary' }}
          onClick={handleCreateNewProject}
        >
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Create new project</ListItemText>
        </MenuItem>
      </Menu>
    );
  };

  const handleCreateNewProject = async () => {
    setAnchorProjects(null);
    setOpenProjectDialog(true);
  };

  const handleSelectProject = async (projectId) => {
    setAnchorProjects(null);
    //console.log("projectId", projectId)
    setLoading(true);

    await ProjectDataService.switchProject(projectId);

    const projectData = await ProjectDataService.getProjectData(projectId);
    setProject(projectData);

    const userData = await UserDataService.getUserData();
    setUser(userData);
    setLoading(false);
  };

  const handleClickPreview = async () => {
    history.push('/preview');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      //color="secondary"
      //className={classes.appBar}
      sx={sxAppBar}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {user ? btnProjectList() : <div></div>}

        {/* Projects menu */}
        {user && menuProjectList()}

        {/* Log Out menu */}
        <UserMenu userMenuState={{ userMenu, setUserMenu }} />

        <Box>
          <Button
            color="inherit"
            size="large"
            startIcon={<VisibilityIcon />}
            //sx={{textTransform: 'none'}}
            sx={{ marginRight: 2 }}
            onClick={handleClickPreview}
          >
            Preview
          </Button>

          {user && btnAccount()}
        </Box>
      </Toolbar>

      {/* New Project Dialog */}
      <ProjectDialog openState={{ openProjectDialog, setOpenProjectDialog }} />
    </AppBar>
  );
};

export default TopMenu;
