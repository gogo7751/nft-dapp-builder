import { db } from "../firebase-config";
import { getDoc, setDoc, doc, deleteDoc } from "firebase/firestore";
import MerkleTree from "merkletreejs";
import keccak256 from "keccak256";

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
      ["publishDate"]: ts,
      ["updatedDate"]: ts,
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

  getProof = async (senderAddr, whitelistUrl) => {
    if (whitelistUrl === undefined) {
      return [];
    } else {
      const response = await fetch(whitelistUrl);
      const text = await response.text();
      const whiteList = text.split("\n").filter(String);
      const leafNodes = whiteList.map((addr) => keccak256(addr));
      const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
      const senderHashedAddress = keccak256(senderAddr);
      const proofs = tree.getHexProof(senderHashedAddress);
      return proofs;
    }
  };

  getMented = (nowTokenId, website) => {
    const current_sale_phase = website?.contract.current_sale_phase;
    const total_amounts = website?.contract?.sale_phases.map(
      (phase) => phase.total_amount
    );
    total_amounts.unshift(1);
    total_amounts.pop();
    let phaseSupplyStartIndex = total_amounts.map((elem, index) =>
      total_amounts.slice(0, index + 1).reduce((a, b) => a + b)
    );
    return nowTokenId - phaseSupplyStartIndex[current_sale_phase];
  };
}

export default new WebsiteDataService();
