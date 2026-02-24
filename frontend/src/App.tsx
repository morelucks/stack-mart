import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Connect } from '@stacks/connect-react';
import { HomePage } from './pages/HomePage';
import { ListingDetail } from './pages/ListingDetail';
import { TokenPage } from './pages/TokenPage';
import { Header } from './components/Header';
import { userSession } from './utils/auth';

function App() {
  return (
    <Connect
      authOptions={{
        appDetails: {
          name: 'StackMart',
          icon: window.location.origin + '/logo.png',
        },
        redirectTo: '/',
        onFinish: () => {
          window.location.reload();
        },
        userSession,
      }}
    >
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listing/:id" element={<ListingDetail listingId={1} />} />
            <Route path="/token" element={<TokenPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Connect>
  );
}

export default App;
