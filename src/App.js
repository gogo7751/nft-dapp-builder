import { useMemo, useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase-config'
import { UserContext } from './UserContex'
import UserDataService from './services/UserDataService'
import ProjectDataService from './services/ProjectDataService'

import Layout from './components/Layout'
import Preview from './components/Preview'
import WebsiteEditor from './pages/WebsiteEditor'
import ContractEditor from './pages/ContractEditor'
import Website from './pages/Website'
import Home from './pages/Home'
import Loading from './components/Loading'

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF0F67',
    },
    secondary: {
      main: '#262626',
    },
  },
  typography: {
    fontFamily: 'Quicksand',
    fontWeightLight: 400,
    fontWeightRegular: 500,
    fontWeightMedium: 600,
    fontWeightBold: 700,
  }
})

// const defaultTheme = createTheme({
// })

function App() {
  const [user, setUser] = useState(null)
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(false)
  const value = useMemo(() => ({ 
    user, setUser, 
    project, setProject,
    loading, setLoading
  }), [user, setUser, project, setProject, loading])

  useEffect(()=> {
    onAuthStateChanged(auth, async (currentUser) => {
      if(currentUser) {
        setLoading(true)
        const userData = await UserDataService.getUserData()
        setUser(userData)
        console.log("userData", userData)

        if(userData?.projects) {
          const projectItem = userData.projects[0]          
          const projectData = await ProjectDataService.getProjectData(projectItem.project_id)
          setProject(projectData)
          console.log("projectData", projectData)
        }
        else {
          setProject(null)
        }
        setLoading(false)
      }
      else {
        setUser(null)
        setProject(null)
      }
    })  
  }, [])

  return (
    <ThemeProvider theme={theme}>
    {/* <ThemeProvider theme={defaultTheme}> */}
      <Router>
        <UserContext.Provider value={value}>
        <Layout>
          <Switch>            
            <Route exact path="/">
              <Home />
            </Route>


            {/* <Route exact path="/dashboard">
              <Dashboard />
            </Route> */}

            {/* <Route exact path="/assets">
              <Assets />
            </Route> */}

            <Route exact path="/website">
              <WebsiteEditor />
            </Route>

            <Route exact path="/contract">
              <ContractEditor />
            </Route>

            <Route exact path="/preview">
              <Preview>
                <Website/>
              </Preview>
            </Route>
                        
          </Switch>
        </Layout>

        {/* Loading */}
        <Loading enabled={loading}/>

        </UserContext.Provider>
      </Router>
    </ThemeProvider>      
  );
}

export default App;