import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../../components/OAuth';

export default function LoginPage() {
  const [formData, setFormData] = useState({});
  const {   loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/dashboard');
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div className="min-h-screen relative bg-black overflow-hidden">
      {/* Sparkle effects */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-500 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-transparent bg-clip-text">
            StudySync
          </h1>
        </div>

        {/* Main content */}
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Continue your learning journey
            </p>
          </div>

          <div className="mt-8 bg-gray-900/40 backdrop-blur-xl p-8 rounded-2xl border border-gray-800/50 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Email address"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 rounded-lg text-white bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? 'Loading...' : 'Sign In'}
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                </div>
              </div>

              <OAuth />
            </form>
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link 
                to="/sign-up" 
                className="font-medium bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text hover:from-purple-300 hover:to-cyan-300"
              >
                Start Learning
              </Link>
            </p>
          </div>

          {error && (
            <div className="mt-4 text-center text-sm text-red-400 bg-red-900/20 py-2 px-4 rounded-lg">
              {error.message || 'Something went wrong!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

{/* Add this to your global CSS or Tailwind config */}
const style = {
  '@keyframes twinkle': {
    '0%, 100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
    '50%': {
      opacity: 0.3,
      transform: 'scale(0.5)',
    },
  },
  '.animate-twinkle': {
    animation: 'twinkle 3s infinite',
  },
};