import { v4 as uuidv4 } from 'uuid'
import { db } from "../firebase-config"
//import { collection, getDocs, getDoc, setDoc, updateDoc, deleteDoc, doc, addDoc } from "firebase/firestore"
import { getDoc, setDoc, doc } from "firebase/firestore"
import { auth } from '../firebase-config'

class ProjectDataService {

    createProject = async (name) => {
        const projectId  = uuidv4()
        const user = auth.currentUser
        const address = user.uid

        // create project
        const projectData = {
            project_id: projectId,
            name: name,
            user: address,
            project_info: {
                name: name
            },
            mint_section: {
                title: "MINT YOUR NFT NOW",
            },
            description_sction: {
                title: "About"
            },
            faq_section: {
                title: "FAQ",
                display: true
            },
            roadmap_section: {
                title: "Roadmap",
                display: true
            },
            team_section: {
                title: "Team",
                display: true
            }

        }

        // update user's project list
        await setDoc(doc(db, "projects", projectId), projectData)
        const userRef = doc(db, "users", address)
        const userDoc = await getDoc(userRef)
        const userData = userDoc.data()
        const projectList = userData?.projects
        const projectItem = {
            project_id: projectId,
            name: name,
        }

        if( !projectList) {            
            await setDoc(userRef, { 
                projects: [projectItem],
            }, { merge: true });
        }
        else {                        
            await setDoc(userRef, { 
                projects: [projectItem].concat(projectList),
            }, { merge: true });
        }

        return projectId
    }

    getProjectData = async (projectId) => {
        const projectRef = doc(db, "projects", projectId)
        const projectDoc = await getDoc(projectRef)
        return projectDoc.data()
    }

    updateProjectData = async (projectData) => {
        const projectRef = doc(db, "projects", projectData.project_id)
        await setDoc(projectRef, projectData, { merge: true });
    }

    switchProject = async (projectId) => {
        // update user's project list
        const user = auth.currentUser
        const address = user.uid

        const userRef = doc(db, "users", address)
        const userDoc = await getDoc(userRef)
        const userData = userDoc.data()
        const projectList = userData?.projects

        if(projectList) {            
            projectList.sort((x,y)=>{ return x.project_id === projectId ? -1 : y.code === projectId ? 1 : 0; });
            //console.log("projectList:", projectList)

            await setDoc(userRef, { 
                projects: projectList,
            }, { merge: true });
        }
    }
}

export default new ProjectDataService()