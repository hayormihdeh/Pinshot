import { AppRoutes } from '@routes';
import { AuthProvider } from '@config';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
