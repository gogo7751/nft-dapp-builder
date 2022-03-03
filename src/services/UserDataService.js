import { db } from "../firebase-config"
//import { collection, getDocs, getDoc, setDoc, updateDoc, deleteDoc, doc, addDoc } from "firebase/firestore"
import { getDoc, doc } from "firebase/firestore"
import { auth } from '../firebase-config'


class UserDataService {

    getUserData = async () => {        
        const user = auth.currentUser        
        const userRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userRef)
        return userDoc.data()
    }
}

export default new UserDataService()