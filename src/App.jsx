import { WalletProvider } from './contexts/WalletContext';
import { DigitalTimeCapsuleProvider } from './contexts/DigitalTimeCapsuleContext';
import { Navbar } from './components/Navbar';
import { CreateCapsule } from './components/CreateCapsule';
import { CapsulesList } from './components/CapsulesList';

const App = () => {
  return (
    <WalletProvider>
      <DigitalTimeCapsuleProvider>
        <div className='min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50'>
          <Navbar />
          <main className='container mx-auto py-8 px-4'>
            <CreateCapsule />
            <CapsulesList />
          </main>
        </div>
      </DigitalTimeCapsuleProvider>
    </WalletProvider>
  );
};

export default App;
