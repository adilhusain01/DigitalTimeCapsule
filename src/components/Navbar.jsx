import { useWallet } from '../contexts/WalletContext';
import { Clock, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const { account, connectWallet } = useWallet();

  return (
    <nav className='bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center space-x-2'>
            <Clock className='w-6 h-6 text-white' />
            <h1 className='text-xl font-bold text-white'>
              Digital Time Capsule
            </h1>
          </div>
          <Button
            onClick={connectWallet}
            className='bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm'
          >
            <Wallet className='w-4 h-4 mr-2' />
            {account
              ? `${account.slice(0, 6)}...${account.slice(-4)}`
              : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    </nav>
  );
};
