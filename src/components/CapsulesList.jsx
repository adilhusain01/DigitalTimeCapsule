// components/CapsulesList.js
import { useState } from 'react';
import { Clock, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDigitalTimeCapsule } from '../contexts/DigitalTimeCapsuleContext';

// Helper function to calculate time remaining
const getTimeRemaining = (unlockTime) => {
  const now = new Date();
  const diff = unlockTime.getTime() - now.getTime();
  
  if (diff <= 0) return 'Ready to reveal';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  return `${days}d ${hours}h remaining`;
};


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
    return (
      <div className='text-center py-4 text-violet-600'>
        Loading capsules...
      </div>
    );
  if (error)
    return <div className='text-red-500 text-center py-4'>{error}</div>;

  return (
    <div className='max-w-4xl mx-auto'>
      <h2 className='text-2xl font-bold mb-6 flex items-center text-violet-900'>
        <Lock className='w-6 h-6 mr-2' />
        Your Time Capsules
      </h2>
      <div className='grid gap-6 md:grid-cols-2'>
        {capsules.map((capsule) => (
          <Card key={capsule.id} className='hover:shadow-lg transition-shadow'>
            <CardContent className='pt-6'>
              <h3 className='text-xl font-semibold mb-2 text-violet-900'>
                {capsule.title}
              </h3>
              <p className='text-gray-600 mb-2'>{capsule.description}</p>
              <p className='text-sm text-gray-500 mb-4'>
                Unlocks: {capsule.unlockTime.toLocaleString()}
              </p>
              {capsule.isReady ? (
                <Button
                  onClick={() => handleReveal(capsule.id)}
                  className='w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                >
                  <Lock className='w-4 h-4 mr-2' />
                  Reveal Message
                </Button>
              ) : (
                <div className='text-sm text-orange-500 flex items-center'>
                  <Clock className='w-4 h-4 mr-2' />
                  {getTimeRemaining(capsule.unlockTime)}
                </div>
              )}
              {selectedCapsule === capsule.id && revealedMessage && (
                <div className='mt-4 p-4 bg-violet-50 rounded-lg border border-violet-100'>
                  <h4 className='font-medium mb-2 text-violet-900'>
                    Revealed Message:
                  </h4>
                  <p className='text-violet-700'>{revealedMessage}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {capsules.length === 0 && (
        <Card className='text-center p-8'>
          <div className='text-gray-500'>
            No time capsules created yet. Create your first one!
          </div>
        </Card>
      )}
    </div>
  );
};
