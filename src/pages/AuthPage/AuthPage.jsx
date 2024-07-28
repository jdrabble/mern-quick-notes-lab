import SignUpForm from '../../components/SignUpForm/SignUpForm';
import LoginForm from '../../components/LogInForm/LogInForm';
import { useState } from 'react';

function AuthPage({setUser}) {
  const [showSignUp, setShowSignUp] = useState(false);
    return (
     <div>
       <h1>AuthPage</h1>
      <button onClick={() => setShowSignUp(!showSignUp)}>{showSignUp ? 'Log In' : 'Sign Up'}</button>
      { showSignUp ?
          <SignUpForm setUser={setUser} />
          :
          <LoginForm setUser={setUser} />
      }
     </div>
);
}

export default AuthPage;