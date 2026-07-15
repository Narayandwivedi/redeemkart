import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { X, Phone } from 'lucide-react';

const GoogleLogin = () => {
  const { BACKEND_URL, checkAuthStatus } = useContext(AppContext);
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const isGoogleLoaded = useRef(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pendingCredential, setPendingCredential] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts && !isGoogleLoaded.current) {
        initializeGoogleSignIn();
        isGoogleLoaded.current = true;
      } else if (!isGoogleLoaded.current) {
        setTimeout(checkGoogleLoaded, 100);
      }
    };
    checkGoogleLoaded();
  }, []);

  const initializeGoogleSignIn = () => {
    if (!window.google) {
      console.error('Google SDK not loaded');
      return;
    }
    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: 'outline',
            size: 'large',
            width: '280',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'center'
          }
        );
      }
    } catch (error) {
      console.error('Google initialization error:', error);
    }
  };

  const sendToBackend = async (credential, phone) => {
    const body = phone ? { credential, phone } : { credential };
    const result = await fetch(`${BACKEND_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    return result.json();
  };

  const handleCredentialResponse = async (response) => {
    try {
      const data = await sendToBackend(response.credential);

      if (data.success) {
        await checkAuthStatus();
        navigate('/');
      } else if (data.message?.toLowerCase().includes('phone number is required')) {
        setPendingCredential(response.credential);
        setShowPhoneModal(true);
      } else {
        toast.error(data.message || 'Google login failed');
      }
    } catch (error) {
      toast.error('Google login failed. Please try again.');
    }
  };

  const handlePhoneSubmit = async () => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setSubmitting(true);
    try {
      const data = await sendToBackend(pendingCredential, cleaned);
      if (data.success) {
        setShowPhoneModal(false);
        setPhoneNumber('');
        setPendingCredential(null);
        await checkAuthStatus();
        navigate('/');
      } else {
        toast.error(data.message || 'Google login failed');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualClick = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        }
      });
    } else {
      toast.error('Google Sign-In is not loaded. Please refresh and try again.');
    }
  };

  return (
    <>
      <div className="w-full flex justify-center items-center">
        <div
          ref={googleButtonRef}
          className="w-full flex justify-center"
          style={{ minHeight: '44px' }}
        >
          <button
            onClick={handleManualClick}
            className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 border border-gray-300 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>

      {/* Phone Number Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 relative">
            <button
              onClick={() => { setShowPhoneModal(false); setPhoneNumber(''); setPendingCredential(null); }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="bg-violet-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-violet-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Mobile Number Required</h3>
              <p className="text-sm text-gray-500 mt-1">Please enter your mobile number to complete signup</p>
            </div>

            <input
              type="tel"
              inputMode="numeric"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter 10-digit mobile number"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-600/20 focus:border-violet-600 transition-all text-sm font-medium text-center tracking-widest"
              autoFocus
            />

            <button
              onClick={handlePhoneSubmit}
              disabled={submitting || phoneNumber.length < 10}
              className="w-full mt-4 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? 'Verifying...' : 'Continue'}
            </button>

            <p className="text-[10px] text-gray-400 text-center mt-3">
              By continuing, you agree to our Terms of Service
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleLogin;