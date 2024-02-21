import { Outlet } from 'react-router-dom';
// import PropTypes from 'prop-types';
import {Header} from "@components"
import { useLocation } from 'react-router-dom';

export default function Root() {
  const location = useLocation()
  const paths = ["/login", "/signup"]
  const matchPaths = paths.map((path) => path)
  return (
    <>
      <main className="min-vh-100">
        {!matchPaths.includes(location.pathname) && <Header />}
        <Outlet />
      </main>
    </>
  );
}
