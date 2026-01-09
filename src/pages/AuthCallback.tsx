import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate('/doctor/general');
      }
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Verifying your email...
    </div>
  );
};

export default AuthCallback;
