import { useContext, useEffect, useState } from "react";
import { BookOpen } from "react-feather";
import { Link, NavLink } from "react-router-dom";
import { authContext } from "contexts/auth";
import logo from '../../public/avatar2.png';
import "./Navbar.scss";
import axios from "axios";

export default function Navbar() {
  const { currentUser, logout } = useContext(authContext);
  const [showUserCard, setShowUserCard] = useState(false);
  const [profileImage, setProfileImage] = useState(logo)
  console.log("currentUser : " + currentUser)
  function closeUserCard(e) {
    // console.log(e.target);
    const $userCard = document.querySelector(".user");
    if (e.target === $userCard) {
      return;
    }

    setShowUserCard(false);
  }

  useEffect(() => {
    document.addEventListener("click", closeUserCard);
    return () => document.removeEventListener("click", closeUserCard);
  });

  useEffect(() => {
    // Fetch the image data from the Spring Boot backend
    if (currentUser != null) {
      axios.get(`/images/user/${currentUser.profileImagePath}`, { responseType: 'arraybuffer' })
        .then(response => {
          // Convert the image data to a base64-encoded string
          const base64Image = btoa(
            new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          setProfileImage(`data:image/jpeg;base64,${base64Image}`);
        })
        .catch(error => {
          console.error('Error fetching image:', error);
        });
    }

  }, []);

  function handleAvatarClick(e) {
    if (!showUserCard) {
      setShowUserCard(true);
    }

    e.stopPropagation();
  }

  return (
    <nav className="navbar">
      <div className="wrapper">
        <h1>
          <Link to="/">
            <BookOpen />
            <div>
              <span>Blog</span>
              <small>SATISH YADAV</small>
            </div>
          </Link>
        </h1>
        <div className="navbar__links">
          <NavLink to="/" end={true}>
            Home
          </NavLink>
          <NavLink to="/write">Write</NavLink>
          {!currentUser && <NavLink to="/login">Login</NavLink>}
        </div>

        {currentUser && (
          <img
            src={profileImage}
            className="user-avatar avatar"
            alt="User's avatar"
            onClick={handleAvatarClick}
          />
        )}

        {currentUser && (
          <div className={`user ${showUserCard ? "user--active" : ""}`}>
            <Link to={`/users/${currentUser.id}`}>
              {currentUser.profileImagePath ? <img src={profileImage} className="user__avatar" alt="User's avatar" /> :
                <img src={logo} className="user__avatar" alt="User's avatar" />
              }

            </Link>
            <Link to={`/users/${currentUser.id}`} className="user__name">
              {currentUser.name}
            </Link>
            <small className="user__email">{currentUser.email}</small>
            <button className="btn user__logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
