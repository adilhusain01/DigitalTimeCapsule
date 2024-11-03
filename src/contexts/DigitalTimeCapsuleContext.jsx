// DigitalTimeCapsuleContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './WalletContext';
import { contractAddress, contractABI } from '../utils/contractHelpers';

const DigitalTimeCapsuleContext = createContext();

export const DigitalTimeCapsuleProvider = ({ children }) => {
  const { signer, account } = useWallet();
  const [contract, setContract] = useState(null);
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (signer) {
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      setContract(contractInstance);
      loadUserCapsules();
    }
  }, [signer, account]);

  const loadUserCapsules = async () => {
    if (!contract || !account) return;

    try {
      setLoading(true);
      const capsuleIds = await contract.getCapsulesByUser(account);
      const capsulePromises = capsuleIds.map(async (id) => {
        const details = await contract.getCapsuleDetails(id);
        return {
          id: id.toString(),
          creator: details.creator,
          unlockTime: new Date(details.unlockTime * 1000),
          isRevealed: details.isRevealed,
          title: details.title,
          description: details.description,
          isReady: await contract.isCapsuleReady(id),
        };
      });

      const loadedCapsules = await Promise.all(capsulePromises);
      setCapsules(loadedCapsules);
    } catch (err) {
      setError('Failed to load capsules: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCapsule = async (message, unlockTime, title, description) => {
    if (!contract) throw new Error('Contract not initialized');

    try {
      setLoading(true);
      // Simple encryption - in production use more secure methods
      const encryptedMessage = btoa(message);
      const unixTime = Math.floor(new Date(unlockTime).getTime() / 1000);

      const tx = await contract.createCapsule(
        encryptedMessage,
        unixTime,
        title,
        description
      );
      await tx.wait();
      await loadUserCapsules();
    } catch (err) {
      setError('Failed to create capsule: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const revealCapsule = async (capsuleId) => {
    if (!contract) throw new Error('Contract not initialized');

    try {
      setLoading(true);
      const encryptedMessage = await contract.revealCapsule(capsuleId);
      // Simple decryption - in production use more secure methods
      const decryptedMessage = atob(encryptedMessage);
      return decryptedMessage;
    } catch (err) {
      setError('Failed to reveal capsule: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCapsule = async (capsuleId, newMessage) => {
    if (!contract) throw new Error('Contract not initialized');

    try {
      setLoading(true);
      const encryptedMessage = btoa(newMessage);
      const tx = await contract.updateCapsule(capsuleId, encryptedMessage);
      await tx.wait();
      await loadUserCapsules();
    } catch (err) {
      setError('Failed to update capsule: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DigitalTimeCapsuleContext.Provider
      value={{
        capsules,
        loading,
        error,
        createCapsule,
        revealCapsule,
        updateCapsule,
        loadUserCapsules,
      }}
    >
      {children}
    </DigitalTimeCapsuleContext.Provider>
  );
};

export const useDigitalTimeCapsule = () =>
  useContext(DigitalTimeCapsuleContext);
