import { useState } from 'react';
import { useDigitalTimeCapsule } from '../contexts/DigitalTimeCapsuleContext';
import { Send, Plus, Clock, MessageSquare, Info, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    <div className='mx-auto max-w-2xl px-4'>
      <Card className='backdrop-blur-sm bg-white/90 shadow-xl border-0 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 pointer-events-none' />

        <CardHeader className='space-y-1 pb-8'>
          <CardTitle className='text-2xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent flex items-center gap-2'>
            <Plus className='w-6 h-6 text-violet-600' />
            Create New Time Capsule
          </CardTitle>
          <Alert className='mt-4 bg-violet-50 border border-violet-200'>
            <Info className='h-4 w-4 text-violet-600' />
            <AlertDescription>
              Create a secure time capsule to store your memories and reveal
              them at a specific time in the future.
            </AlertDescription>
          </Alert>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <label className='flex items-center text-sm font-medium text-gray-700 gap-1.5'>
                <FileText className='w-4 h-4 text-violet-600' />
                Title
              </label>
              <Input
                type='text'
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className='border-2 border-violet-100 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all rounded-lg'
                placeholder='Give your time capsule a meaningful title'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='flex items-center text-sm font-medium text-gray-700 gap-1.5'>
                <MessageSquare className='w-4 h-4 text-violet-600' />
                Message
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className='h-32 border-2 border-violet-100 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all rounded-lg resize-none'
                placeholder='Write your message for the future...'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='flex items-center text-sm font-medium text-gray-700 gap-1.5'>
                <Info className='w-4 h-4 text-violet-600' />
                Description
              </label>
              <Input
                type='text'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className='border-2 border-violet-100 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all rounded-lg'
                placeholder='Add a brief description of your time capsule'
                required
              />
            </div>

            <div className='space-y-2'>
              <label className='flex items-center text-sm font-medium text-gray-700 gap-1.5'>
                <Clock className='w-4 h-4 text-violet-600' />
                Unlock Time
              </label>
              <Input
                type='datetime-local'
                value={formData.unlockTime}
                onChange={(e) =>
                  setFormData({ ...formData, unlockTime: e.target.value })
                }
                className='border-2 border-violet-100 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all rounded-lg'
                required
              />
            </div>

            <Button
              type='submit'
              disabled={loading}
              className='w-full h-12 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 
                text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 
                flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed'
            >
              {loading ? (
                <>
                  <div className='w-5 h-5 border-t-2 border-white rounded-full animate-spin' />
                  Creating...
                </>
              ) : (
                <>
                  <Send className='w-5 h-5' />
                  Create Time Capsule
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
