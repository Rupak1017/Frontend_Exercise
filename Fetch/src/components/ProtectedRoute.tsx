import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// This component protects routes by allowing access only if the user is authenticated.
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const navigate = useNavigate();
  // isAuth: true means authenticated, false means not authenticated, null means authentication status is still unknown.
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  
  useEffect(() => {
    // Call the API to verify the user's credentials
    axios.get('https://frontend-take-home-service.fetch.com/dogs/breeds', { withCredentials: true })
      .then(() => {
        // If API call is successful, set authentication status to true.
        setIsAuth(true);
      })
      .catch((error) => {
        // If we receive a 401 error, it means the user is not authenticated.
        if (error.response && error.response.status === 401) {
          setIsAuth(false);
          // Redirect the user to the home page if not authenticated.
          navigate('/', { replace: true });
        }
      });
  }, [navigate]);

  // While waiting for authentication response, display a loading message.
  if (isAuth === null) {
    return <div>Loading...</div>;
  }
  
  // Once authenticated, render the child elements inside this protected route.
  return children;
};

export default ProtectedRoute;
