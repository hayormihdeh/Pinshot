import { Row, Col, Image } from 'react-bootstrap';
import { MyButton } from '@components';
import { Link } from 'react-router-dom';
import styles from './home.module.css';

function Home() {
  const imgs = [
    'https://unsplash.com/photos/stNs_FzKuRA/download?force=true&w=640',

    'https://unsplash.com/photos/2D4vFlcQGzM/download?force=true&w=640',

    'https://unsplash.com/photos/rZBmXd-oqW8/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzA4MTAzOTUwfA&force=true&w=640',

    'https://unsplash.com/photos/zdLdgGbi9Ow/download?force=true&w=640',
  ];

  return (
    <div className="mt-md-5 px-0">
      <div className="d-none d-md-block py-5">
        <h1 className="text-center my-5 display-4 fw-bold">
          See what your friends <br />
          <span style={{ color: ' var(--teal100)' }}>are up to</span>
        </h1>
        <Row className="g-3 px-3">
          {imgs.map((img, i) => (
            <Col key={i} md={4} lg={3}>
              <Image src={img} className="img-fluid rounded-4" />
            </Col>
          ))}
        </Row>
      </div>

      {/* Mobile view */}
      <div
        className={`d-md-none d-flex justify-content-center align-items-center ${styles.bgImg}`}
      >
        <div
          className={`${styles.bgDark} position-absolute top-0 w-100 h-100`}
        />

        <div
          className={`${styles.hero} position-absolute top-50 start-50 translate-middle w-100 text-center`}
        >
          <Image
            src={
              'https://res.cloudinary.com/ceenobi/image/upload/v1706179614/pintube/Frame_16_ecr4pq.svg'
            }
            alt="logo"
            style={{ width: '200px' }}
          />
          <h1 className="my-4 text-center text-white fw-bold display-5">
            Post, Like, Comment
          </h1>
          <Link to="signup">
            <MyButton
              className="border-0 bg-warning text-dark rounded-pill"
              style={{ minWidth: '50%' }}
              text="Sign Up"
              size="lg"
            />
          </Link>
          <p className="text-white mt-4 fw-medium">
            Already a member?{' '}
            <Link to="/login">
              <span className="fw-bold">Log In</span>
            </Link>
          </p>
        </div>
      </div>

      <div
        className={`d-md-flex justify-content-center justify-content-md-between align-items-center ${styles.explore}`}
      >
        <div>
          <Image
            src={
              'https://unsplash.com/photos/YSB0wB74Gpg/download?ixid=M3wxMjA3fDB8MXx0b3BpY3x8UzRNS0xBc0JCNzR8fHx8fDJ8fDE3MDgxMTY3OTV8&force=true&w=640'
            }
            alt="logo"
            className={styles.imgAdjust}
          />
        </div>
        <div className="text-center p-4 w-100">
          <h1
            className="my-4 fw-bold display-5"
            style={{ color: 'var(--teal200' }}
          >
            See ideas you like
          </h1>
          <p className="lead" style={{ color: 'var(--teal200' }}>
            Browse through our collection of posts, see pictures <br />
            and get inspired for your next big thing.
          </p>
          <Link to="/explore">
            <MyButton
              className={`${styles.btn} border-0 rounded-pill `}
              text="Explore"
              size="lg"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
