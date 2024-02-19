import { HashLoader } from 'react-spinners';
import propTypes from "prop-types"

export default function Spinner({ text }) {
  return (
    <div className="d-flex flex-column gap-2 justify-content-center align-items min-vh-100">
      <HashLoader/>
      <p className = "fw-medium">{text}</p>
    </div>
  );
}


Spinner.propTypes = {
    text : propTypes.string
}