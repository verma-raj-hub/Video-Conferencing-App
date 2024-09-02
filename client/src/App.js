import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MeetRoom from './pages/MeetRoom.jsx'
import { Route, Routes } from 'react-router-dom';
import RouteProtector from './protectedRoute/RouteProtector';
import LoginProtector from './protectedRoute/LoginProtector';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './pages/Profile';

function App() {


  return (
    <div className="App">
      <Routes>
        <Route path="/" element={  <Home /> } />
        <Route path = '/login' element={<LoginProtector><Login /></LoginProtector>  } />
        <Route path='/register' element={<LoginProtector><Register /></LoginProtector>} />
        <Route path="/meet/:id" element={ <RouteProtector> <MeetRoom /> </RouteProtector>} />
        <Route path="/profile" element={ <RouteProtector> <Profile /> </RouteProtector>} />
        {/* <Route path="/myMeets" element={ <RouteProtecter> <MyMeets/> </RouteProtecter>} /> */}
      </Routes>
      
    </div>
  );
}

export default App;
