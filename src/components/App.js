import React , { useState, useEffect }from 'react';
import AppRouter from "components/Router";
import { authService } from 'fbase';



function App() {
  const [init, setInit] = useState(false);
  const [userObj , setUserObj] = useState(null);

  useEffect( ()=> {
    authService.onAuthStateChanged(   (user) => {
      console.log(user);
      if(user)
      {
        setUserObj(
          {
            displayName : user.displayName ,
            uid : user.uid,
            updateProfile : (args) => user.updateProfile(args),
          }
        );      
      }else{
        setUserObj(null);
      }
     
      setInit(true);
    } );
  }, []) ; 

const refreshUser = ()=>{
    const user = authService.currentUser;
    if (user)
    {
      setUserObj({
        displayName : user.displayName ,
        uid : user.uid,
        updateProfile : (args) => user.updateProfile(args),
      });
    }else{
      setUserObj(null);
    }
}; 


  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj}/> : "Initializing..."}
      <footer>&copy; nwitter {new Date().getFullYear()} </footer>
    </>
  );
}

export default App;
