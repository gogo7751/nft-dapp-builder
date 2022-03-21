//import { signInWithCustomToken, onAuthStateChanged, signOut } from 'firebase/auth'
import { signInWithCustomToken, signOut } from 'firebase/auth';
import { ethers } from 'ethers';
import { auth } from '../firebase-config';

class AccountService {
  getWalletAddress = async (errorHandler) => {
    try {
      if (!window.ethereum) {
        throw new Error('No crypto wallet found. Please install it.');
      }

      await window.ethereum.send('eth_requestAccounts');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      return address;
    } catch (err) {
      errorHandler(err);
    }
  };

  fetchNonce = async (address) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: address }),
    };
    const response = await fetch(
      process.env.REACT_APP_FIREBASE_SERVICE + '/getNonceToSign',
      requestOptions
    );
    const data = await response.json();
    return data.nonce;
  };

  signNonce = async (nonce, errorHandler) => {
    try {
      await window.ethereum.send('eth_requestAccounts');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signature = await signer.signMessage(nonce);
      return signature;
    } catch (err) {
      errorHandler(err);
    }
  };

  verifySignature = async ({ address, signature }) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: address, signature: signature }),
    };
    const response = await fetch(
      process.env.REACT_APP_FIREBASE_SERVICE + '/verifySignedMessage',
      requestOptions
    );
    const data = await response.json();
    return data.token;
  };

  signin = async (token, errorHandler) => {
    try {
      const user = await signInWithCustomToken(auth, token);
      console.log(user);
    } catch (err) {
      errorHandler(err);
    }
  };

  signOut = async () => {
    await signOut(auth);
  };
}

export default new AccountService();
