import {
  Image,
  Form,
  InputGroup,
  Button,
  Stack,
  Container,
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
} from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuthContext } from '@hooks';
import styles from './nav.module.css';
import MyButton from '../MyButton';
import { PiCameraPlus } from 'react-icons/pi';
import { userService } from '@services';

//diference between NavLink and Link in react

export default function Header() {
  const location = useLocation();
  const { loggedInUser } = useAuthContext();
  const logoutUser = () => {
    userService.logout()
  }
  return (
    <Container fluid className={`${styles.navContainer} fixed-top w-100 p-3`}>
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

          <NavLink
            to="/explore"
            className={({ isActive }) =>
              isActive ? 'activeLink fw-bold' : 'no-activeLink fw-bold'
            }
          >
            Explore
          </NavLink>
        </Stack>

        {location.pathname !== '/' && (
          <Form style={{ minWidth: '50%' }} className="mx-auto">
            <InputGroup className=" w-100 rounded-pill border-0 bg-secondary-subtle">
              <Form.Control
                placeholder="Search"
                aria-label="Search bar"
                className="rounded-start-pill border-0
     bg-transparent p-2"
              />
              <Button variant="none" type="submit">
                <FiSearch size="20px" />
              </Button>
            </InputGroup>
          </Form>
        )}

        {loggedInUser ? (
          <Stack direction='horizontal' gap={3}>
            <NavLink
              to="/create-pin"
              className={({ isActive }) =>
                isActive ? 'activeLink' : 'no-activeLink'
              }
            >
              <PiCameraPlus size="30px" />
            </NavLink>
            {/* *** */}
            <Dropdown>
              <Dropdown.Toggle variant="none" id="dropdown-basic">
                <Image
                src = {loggedInUser?.profilePhoto} roundedCircle
                className='object-fit-cover'
                style = {{width: "35px", height:"35px"}}
                alt = {loggedInUser?.userName}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu>
               <Dropdown.ItemText className = "fw-bold">
                Hi, {loggedInUser?.userName}
               </Dropdown.ItemText>
               <Dropdown.Item as = {NavLink} to={`/profile/${loggedInUser?.userName}`}>
                Profile
               </Dropdown.Item>
               <Dropdown.ItemText onClick={logoutUser} className = "cursor">
                LogOut
               </Dropdown.ItemText>
              </Dropdown.Menu>
            </Dropdown>
           {/* *** */}
          </Stack>
        ) : (
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
                className="d-none d-md-block border-0 bg-secondary-subtle text-dark p-2 rounded-pill "
                style={{ minWidth: 'fit-content' }}
                text="Sign up"
              />
            </NavLink>
          </Stack>
        )}
      </div>
    </Container>
  );
}
