import PropTypes from 'prop-types';
import { Container } from 'react-bootstrap';


export default function PageLayout({ children, extra, ...props }) {
  return (
    <Container fluid className={`mt-5 py-5 px-3 w-100 ${extra}`} {...props}>
      {children}
    </Container>
  );
}

PageLayout.PropTypes = {
  children : PropTypes.node.isRequired,
  extra: PropTypes.string,
  props: PropTypes.object,
};
