import { Form, FloatingLabel } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function FormFields({
  id,
  label,
  className,
  register,
  errors,
  registerOptions,
  placeholder,
  type,
  name,
  showPassword,
  togglePassword,
  ...props
}) {
  return (
    <FloatingLabel controlId={id} label={label} className={className}>
      <Form.Control
        type={showPassword ? 'text' : type}
        placeholder={placeholder}
        name={name}
        size="lg"
        {...register(name, registerOptions)}
        isInvalid={!!errors}
        className="bg-light.bg-gradient"
        {...props}
      />

      <Form.Control.Feedback type="invalid">
        {errors?.message}
      </Form.Control.Feedback>

      {type === 'password' && (
        <>
          {showPassword ? (
            <span className="position-absolute top-50 end-0 translate-middle cursor" onClick={togglePassword}>
              Hide
            </span>
          ) : (
            <span className="position-absolute top-50 end-0 translate-middle cursor" onClick={togglePassword}>
              Show
            </span>
          )}
        </>
      )}
    </FloatingLabel>
  );
}

FormFields.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  errors: PropTypes.object,
  register: PropTypes.func,
  registerOptions: PropTypes.object,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  props: PropTypes.object,
  showPassword : PropTypes.bool,
  togglePassword :PropTypes.func
};
