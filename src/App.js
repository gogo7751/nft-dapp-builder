import { useMemo, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import { UserContext } from './UserContext';
import UserDataService from './services/UserDataService';
import ProjectDataService from './services/ProjectDataService';

import Layout from './components/Layout';
import Preview from './components/Preview';
import Dashboard from './pages/Dashboard';
import WebsiteEditor from './pages/WebsiteEditor';
import ContractEditor from './pages/ContractEditor';
import Website from './pages/Website';
import Home from './pages/Home';
import Loading from './components/Loading';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF0F67',
    },
    secondary: {
      main: '#262626',
    },
    info: {
      main: '#fff',
    },
  },
  typography: {
    fontFamily: 'Quicksand',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  },
});

// const defaultTheme = createTheme({
// })

function App() {
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const value = useMemo(
    () => ({
      user,
      setUser,
      project,
      setProject,
      loading,
      setLoading,
    }),
    [user, setUser, project, setProject, loading]
  );

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setLoading(true);
        const userData = await UserDataService.getUserData();
        setUser(userData);
        console.log('userData', userData);

        if (userData?.projects) {
          const projectItem = userData.projects[0];
          const projectData = await ProjectDataService.getProjectData(
            projectItem.project_id
          );
          setProject(projectData);
          console.log('projectData', projectData);
        } else {
          setProject(null);
        }
        setLoading(false);
      } else {
        setUser(null);
        setProject(null);
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {/* <ThemeProvider theme={defaultTheme}> */}
      <Router>
        <UserContext.Provider value={value}>
          <Layout>
            <Routes>
              <Route exact path="/" element={<Home/>} />
              <Route exact path="/dashboard" element={<Dashboard />} />

              {/* <Route exact path="/assets">
              <Assets />
            </Route> */}
              <Route exact path="/website" element={<WebsiteEditor />} />
              <Route exact path="/contract" element={<ContractEditor />} />
              <Route exact path="/preview" element={<Preview><Website /></Preview>} />                
            </Routes>
          </Layout>

          {/* Loading */}
          <Loading enabled={loading} />
        </UserContext.Provider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
