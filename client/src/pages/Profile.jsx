import React, { useContext, useEffect } from 'react';
import '../styles/Profile.css';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import ProfileCard from '../components/ProfileCard';
import MeetData from '../components/MeetData';
import { SocketContext } from '../context/SocketContext';

const Profile = () => {
  const userName = localStorage.getItem("userName") || "Guest";
  const userId = localStorage.getItem("userId") || "";
  const { socket, setMyMeets } = useContext(SocketContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      socket.emit("fetch-my-meets", { userId });

      const handleMeetsFetched = ({ myMeets }) => {
        console.log("myMeets", myMeets);
        setMyMeets(myMeets);
      };

      socket.on("meets-fetched", handleMeetsFetched);

      // Cleanup on component unmount
      return () => {
        socket.off("meets-fetched", handleMeetsFetched);
      };
    }
  }, [socket, userId, setMyMeets]);

  const handleLogOut = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <div className='profilePage'>
      <div className="profile-header">
        <div className="profile-logo">
          <h2 onClick={() => { navigate('/') }}>Smart Meet</h2>
        </div>
        <Dropdown>
          <Dropdown.Toggle id="dropdown-basic">
            {userName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item>
              <Link className='dropdown-options' to='/'>Join meet</Link>
            </Dropdown.Item>
            <Dropdown.Item className='dropdown-options' onClick={handleLogOut}>
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="profile-body">
        <div className="profile-card-container">
          <ProfileCard />
        </div>
        <div className="meet-data-container">
          <MeetData />
        </div>
      </div>
    </div>
  );
};

export default Profile;
