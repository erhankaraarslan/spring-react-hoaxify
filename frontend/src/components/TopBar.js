import React, { useEffect, useRef, useState } from "react";
import logo from "../assests/hoaxify.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { logoutSuccess } from "../redux/authActions";
import ProfileImageWithDefault from "./ProfileImageWithDefault";

const TopBar = (props) => {
  //const {t, username, isLoggedIn, onLogoutSuccess } = props;

  const { t } = useTranslation();

  const reduxState = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
    username: store.username,
    displayName: store.displayName,
    image: store.image,
  }));
  const { username, isLoggedIn, displayName, image } = reduxState;

  const menuArea = useRef(null);

  const [menuVisible, setMenuVisible] = useState(false);
  useEffect(() => {
    document.addEventListener("click", menuClickTracker);
    return () => {
      document.removeEventListener("click", menuClickTracker);
    };
  }, [isLoggedIn]);
  const menuClickTracker = (event) => {
    if (menuArea.current === null || !menuArea.current.contains(event.target)) {
      setMenuVisible(false);
    }
  };
  const dispatch = useDispatch();

  const onLogoutSuccess = () => {
    dispatch(logoutSuccess());
  };

  // const { onLogoutSuccess } = props;

  let links = (
    <ul className='navbar-nav ms-auto'>
      <li>
        <Link className='nav-link' to='/login'>
          {t("Login")}
        </Link>
      </li>
      <li>
        <Link className='nav-link' to='/signup'>
          {t("Sign Up")}
        </Link>
      </li>
    </ul>
  );
  if (isLoggedIn) {
    let dropDownClass = "dropdown-menu p-0 shadow";
    if (menuVisible) {
      dropDownClass += " show";
    }
    links = (
      <ul className='navbar-nav ms-auto' ref={menuArea}>
        <li className='nav-item dropdown'>
          <div
            className='d-flex'
            style={{ cursor: "pointer" }}
            onClick={() => {
              setMenuVisible(true);
            }}
          >
            <ProfileImageWithDefault
              image={image}
              width='32'
              height='32'
              className='rounded-circle m-auto'
            />
            <span className='nav-link dropdown-toggle'>{displayName}</span>
          </div>
          <div className={dropDownClass}>
            <Link
              className='dropdown-item d-flex p-2'
              to={`/user/${username}`}
              onClick={() => setMenuVisible(false)}
            >
              <span className='material-icons text-info me-2'>person</span>
              {t("My Profile")}
            </Link>
            <span
              className='dropdown-item d-flex p-2'
              onClick={onLogoutSuccess}
              style={{ cursor: "pointer" }}
            >
              <span className='material-icons text-danger me-2'>
                power_settings_new
              </span>
              {t("Logout")}
            </span>
          </div>
        </li>
      </ul>
    );
  }

  return (
    <div className='shadow-sm bg-light mb-2 '>
      <nav className='navbar navbar-light container navbar-expand'>
        <Link className='navbar-brand' to='/'>
          <img src={logo} width='60' alt='Hoaxify Logo' />
          Hoaxify
        </Link>
        {links}
      </nav>
    </div>
  );
};
//const TopBarWithTranslation = withTranslation()(TopBar);
// const mapStateToProps = (store) => {
//   return {
//     isLoggedIn: store.isLoggedIn,
//     username: store.username,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onLogoutSuccess: () => dispatch(logoutSuccess()),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(TopBar);

export default TopBar;
