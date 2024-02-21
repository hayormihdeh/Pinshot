import { Container, Form, Image } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { MyButton } from '@components';

export default function FormUi({
  title,
  children,
  info,
  to,
  path,
  btnText,
  onSubmit,
  isSubmitting,
}) {
  return (
    <Container
      fluid
      className="min-vh-100 d-flex justify-content-center align-items-center backdrop"
    >
      <Form className="form shadow-lg bg-light bg-opacity-75" onSubmit={onSubmit}>
        <div className="z-3">
          <div className="text-center mb-4">
            <Image
              src={
                'https://res.cloudinary.com/ceenobi/image/upload/v1706179614/pintube/Frame_16_ecr4pq.svg'
              }
              alt="logo"
              style={{ width: '130px', height: 'fit-content' }}
            />
          </div>
          <p className="mb-4 text-center text-uppercase fw-bold fs-4">
            {title}
          </p>
          {children}
          <MyButton
            variant="none"
            type="submit"
            className="w-100 border-0 p-2 my-2 text-white"
            style={{ backgroundColor: 'var(--orangeLight)' }}
            size="lg"
            text={isSubmitting ? <ClipLoader color= "#fffff"/> : btnText}
            disabled = {isSubmitting}
          />

          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-medium">{info}</span>
            <div style={{ color: 'var(--orangeLight', fontWeight: 500 }}>
              <Link to={to}>{path}</Link>
            </div>
          </div>
        </div>
      </Form>
    </Container>
  );
}

FormUi.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  info: PropTypes.string,
  to: PropTypes.string,
  path: PropTypes.string,
  btnText: PropTypes.string,
  isSubmitting : PropTypes.bool,
  onSubmit : PropTypes.string
};
