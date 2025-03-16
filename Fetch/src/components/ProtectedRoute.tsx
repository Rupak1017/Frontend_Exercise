import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
   
    axios.get('https://frontend-take-home-service.fetch.com/dogs/breeds', { withCredentials: true })
      .then(() => {
        setIsAuth(true);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setIsAuth(false);
          navigate('/', { replace: true });
        }
      });
  }, [navigate]);

  if (isAuth === null) {
    return <div>Loading...</div>; 
  }
  
  return children;
};

export default ProtectedRoute;
