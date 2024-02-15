import { Outlet } from 'react-router-dom';
// import PropTypes from 'prop-types';
import {Header} from "@components"

export default function Root() {
  return (
    <>
      <main className="min-vh-100">
        <Header />
        <Outlet />
      </main>
    </>
  );
}
