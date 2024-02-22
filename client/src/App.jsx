import { AppRoutes } from '@routes';
import { AuthProvider } from '@config';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <ToastContainer position = "bottom-right" theme = "dark"  pauseOnHover/>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
