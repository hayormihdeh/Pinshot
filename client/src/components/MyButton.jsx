import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function MyButton({ text, variant, className, ...props }) {
  return (
    <Button variant={variant} className={`${className} fw-bold`} {...props}>
      {text}
    </Button>
  );
}

MyButton.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.string,
  props: PropTypes.object,
};
