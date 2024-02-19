import { Image, Form, InputGroup, Button, Stack } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import styles from './nav.module.css';
import MyButton from '../MyButton';

//diference between NavLink and Link in react

export default function Header() {
  return (
    <div className={`${styles.navContainer}  d-none d-md-block fixed-top w-100 p-3`}>
      <div className="d-flex justify-content-between align-items-center">
        <Stack direction="horizontal" gap={3}>
          <NavLink to="/">
            <Image
              src={
                'https://res.cloudinary.com/ceenobi/image/upload/v1706179614/pintube/Frame_16_ecr4pq.svg'
              }
              alt="logo"
            />
          </NavLink>

          <NavLink to="/explore" className = {({isActive}) => isActive ?  "activeLink fw-bold" : "no-activeLink fw-bold"}>
            Explore
          </NavLink>
        </Stack>

        <Form style={{ minWidth: '50%' }} className = "d-none mx-auto">
          <InputGroup className=" w-100 rounded-pill border-0 bg-secondary-subtle">
            <Form.Control
              placeholder="Search"
              aria-label="Search bar"
              className="rounded-start-pill border-0
              bg-transparent p-2"
            />
            <Button variant="none" type="submit">
              <FiSearch size = "20px"/>
            </Button>
          </InputGroup>
        </Form>

        <div>
          <Stack direction="horizontal" gap={3}>
            <NavLink to="/login">
              <MyButton
                className={`${styles.btn} border-0 p-2 rounded-pill`}
                style={{ minWidth: 'fit-content' }}
                text="Log in"
              />
            </NavLink>

            <NavLink to="/signup">
              <MyButton
                className="border-0 bg-secondary-subtle text-dark p-2 rounded-pill "
                style={{ minWidth: 'fit-content' }}
                text="Sign up"
              />
            </NavLink>
          </Stack>
        </div>
      </div> 
    </div>
  );
}
