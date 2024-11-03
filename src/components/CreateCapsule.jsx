// components/CreateCapsule.js
import { useState } from 'react';
import { useDigitalTimeCapsule } from '../contexts/DigitalTimeCapsuleContext';

export const CreateCapsule = () => {
  const { createCapsule, loading } = useDigitalTimeCapsule();
  const [formData, setFormData] = useState({
    message: '',
    title: '',
    description: '',
    unlockTime: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCapsule(
        formData.message,
        formData.unlockTime,
        formData.title,
        formData.description
      );
      setFormData({ message: '', title: '', description: '', unlockTime: '' });
    } catch (err) {
      console.error('Error creating capsule:', err);
    }
  };

  return (
    <div className='max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold mb-6'>Create New Time Capsule</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>Title</label>
          <input
            type='text'
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className='w-full p-2 border rounded'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Message</label>
          <textarea
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className='w-full p-2 border rounded h-32'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Description</label>
          <input
            type='text'
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className='w-full p-2 border rounded'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Unlock Time</label>
          <input
            type='datetime-local'
            value={formData.unlockTime}
            onChange={(e) =>
              setFormData({ ...formData, unlockTime: e.target.value })
            }
            className='w-full p-2 border rounded'
            required
          />
        </div>
        <button
          type='submit'
          disabled={loading}
          className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300'
        >
          {loading ? 'Creating...' : 'Create Time Capsule'}
        </button>
      </form>
    </div>
  );
};
