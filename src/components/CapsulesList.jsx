// components/CapsulesList.js
import { useEffect, useState } from 'react';
import { useDigitalTimeCapsule } from '../contexts/DigitalTimeCapsuleContext';

export const CapsulesList = () => {
  const { capsules, loading, error, revealCapsule } = useDigitalTimeCapsule();
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [revealedMessage, setRevealedMessage] = useState('');

  const handleReveal = async (capsuleId) => {
    try {
      const message = await revealCapsule(capsuleId);
      setRevealedMessage(message);
      setSelectedCapsule(capsuleId);
    } catch (err) {
      console.error('Error revealing capsule:', err);
    }
  };

  if (loading)
    return <div className='text-center py-4'>Loading capsules...</div>;
  if (error)
    return <div className='text-red-500 text-center py-4'>{error}</div>;

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h2 className='text-2xl font-bold mb-6'>Your Time Capsules</h2>
      <div className='grid gap-6 md:grid-cols-2'>
        {capsules.map((capsule) => (
          <div
            key={capsule.id}
            className='bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow'
          >
            <h3 className='text-xl font-semibold mb-2'>{capsule.title}</h3>
            <p className='text-gray-600 mb-2'>{capsule.description}</p>
            <p className='text-sm text-gray-500 mb-4'>
              Unlocks: {capsule.unlockTime.toLocaleString()}
            </p>
            {capsule.isReady ? (
              <button
                onClick={() => handleReveal(capsule.id)}
                className='bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'
              >
                Reveal Message
              </button>
            ) : (
              <div className='text-sm text-orange-500'>
                Time remaining: {getTimeRemaining(capsule.unlockTime)}
              </div>
            )}
            {selectedCapsule === capsule.id && revealedMessage && (
              <div className='mt-4 p-4 bg-gray-50 rounded'>
                <h4 className='font-medium mb-2'>Revealed Message:</h4>
                <p>{revealedMessage}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {capsules.length === 0 && (
        <div className='text-center text-gray-500 py-8'>
          No time capsules created yet. Create your first one!
        </div>
      )}
    </div>
  );
};

// Helper function for time remaining
const getTimeRemaining = (unlockTime) => {
  const now = new Date();
  const diff = unlockTime.getTime() - now.getTime();

  if (diff <= 0) return 'Ready to reveal';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return `${days}d ${hours}h remaining`;
};
