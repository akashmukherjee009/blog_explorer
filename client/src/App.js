import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import Users from './users/pages/Users';

import MainNavigation from './shared/components/navigation/MainNavigation';
import UserPlace from './places/pages/UserPlaces';
import NewPlace from './places/pages/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './users/pages/Auth';
import { AuthContext } from './shared/context/auth-context';
import { useCallback, useState } from 'react';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid)
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null)
  }, []);

  let routes;

  if (isLoggedIn) {
    routes= (    
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/:userId/places" element={<UserPlace />} />
            <Route path="/places/new" element={<NewPlace />} />
            <Route path="/places/:placeId" element={<UpdatePlace />} />
            
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
  )} else {
    routes=(
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/:userId/places" element={<UserPlace />} />
            <Route path="/auth" element={<Auth />} />
            {/* <Route path='*' element={<Navigate to='/' />} /> */}
          </Routes>
     
  )}
  return (
    <AuthContext.Provider value={{
      isLoggedIn: isLoggedIn,
      userId: userId,
      login: login,
      logout: logout
    }}>
      <Router>
        <MainNavigation />
        <main>
        {routes}
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
