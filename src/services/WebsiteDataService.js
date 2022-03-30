import { db } from "../firebase-config";
import { getDoc, setDoc, doc, deleteDoc } from "firebase/firestore";

class WebsiteDataService {
  getData = async (link) => {
    const websiteRef = doc(db, "websites", link);
    const websiteDoc = await getDoc(websiteRef);
    return websiteDoc.data();
  };

  setData = async (link, project_id) => {
    const projRef = doc(db, "projects", project_id);
    const projDoc = await getDoc(projRef);
    await setDoc(doc(db, "websites", link), projDoc.data());
  };

  syncData = async (link, userToken, project_id) => {
    const projRef = doc(db, "projects", project_id);
    const projDoc = await getDoc(projRef);
    const websiteRef = doc(db, "websites", link);
    const websiteDoc = await getDoc(websiteRef);
    const ts = Math.round(new Date().getTime() / 1000);
    const projectData = {
      ...projDoc.data(),
      ['publishDate']: ts,
      ['updatedDate']: ts,
    };

    if (websiteDoc.data().user === userToken) {
      await setDoc(doc(db, "websites", link), projectData);
      await setDoc(projRef, projectData, { merge: true });
    } else {
      console.log("user token mismatch");
    }
  };

  deleteData = async (link) => {
    return await deleteDoc(doc(db, "websites", link));
  };

  isLinkExist = async (link) => {
    const websiteRef = doc(db, "websites", link);
    const websiteDoc = await getDoc(websiteRef);
    return websiteDoc.exists();
  };
}

export default new WebsiteDataService();
