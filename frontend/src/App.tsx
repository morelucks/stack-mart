import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Connect } from '@stacks/connect-react';
import { HomePage } from './pages/HomePage';
import { ListingDetail } from './pages/ListingDetail';
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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/listing/:id" element={<ListingDetail listingId={1} />} />
        </Routes>
      </BrowserRouter>
    </Connect>
  );
}

export default App;
