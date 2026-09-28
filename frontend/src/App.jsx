import { useEffect } from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import {Toaster} from 'react-hot-toast';

import { useAuthStore } from './store/useAuthStore';
import { useNotificationStore } from './store/useNotificationStore';

import { Navbar } from "./components/Navbar";

import {HomePage} from "./pages/HomePage"
import {SignupPage} from "./pages/SignupPage"
import {LoginPage} from "./pages/LoginPage"
import {ProfilePage} from "./pages/ProfilePage"
import {SettingsPage} from "./pages/SettingsPage"
import { NotificationsPage } from './pages/NotificationsPage';


import {Loader} from 'lucide-react';

const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const {connectNotificationSocket, disconnectNotificationSocket} = useNotificationStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  //connect to notification engine when logged in
  useEffect(() => {
    if(authUser?._id){
      connectNotificationSocket(authUser._id);
    }
    else{
      disconnectNotificationSocket?.();
    }
  }, [authUser?._id])

  // console.log({authUser});
  if(isCheckingAuth && !authUser){
    return(
      <div className='flex items-center justify-center h-screen'>
        <Loader className="size-15"/>
      </div>
    )
  }
  return (
    <div data-theme="dark" className='font-serif'>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" /> }/>
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />}/>
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />}/>
        <Route path="/profile" element={authUser? <ProfilePage /> :  <Navigate to="/login" />}/>
        <Route path="/settings" element={<SettingsPage />}/>
        <Route path="/notifications" element={<NotificationsPage authUser={authUser}/>}/>
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;
