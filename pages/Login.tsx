
import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { Phone, ArrowRight, Chrome, X, MessageSquare } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useApp();
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhone(value);
      setError('');
    }
  };

  const generateAndSendOtp = () => {
    setIsSendingOtp(true);
    // Simulate API delay
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpSent(true);
      setIsSendingOtp(false);
      // Simulate receiving an SMS with a visual alert
      alert(`[Ritva] Your verification code is: ${code}`);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      if (phone.length !== 10) {
        setError('Please enter a valid 10-digit mobile number');
        return;
      }
      generateAndSendOtp();
    } else {
      if (otp === generatedOtp) {
        setIsLoggingIn(true);
        setTimeout(() => login(phone, 'phone'), 800);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    }
  };

  const handleGoogleLogin = (email: string, name: string) => {
    setIsLoggingIn(true);
    setShowGoogleChooser(false);
    // Simulate API delay
    setTimeout(() => {
      login(email, 'google', name);
    }, 1200);
  };

  if (isLoggingIn) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FFFBF7]">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
        <p className="text-orange-950 font-black text-xl animate-pulse">Entering Vault...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#FFFBF7] p-8 max-w-md mx-auto overflow-y-auto relative">
      <div className="mt-12 flex-1">
        <div className="w-24 h-24 bg-orange-600 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-orange-200 mx-auto">
          <img src="https://img.icons8.com/color/96/lotus.png" className="w-14 h-14 brightness-200 invert" alt="Logo" />
        </div>
        
        <div className="text-center mb-12">
          <h1 className="title-font text-6xl text-orange-950 mb-3 tracking-tight">Ritva</h1>
          <p className="text-orange-900/70 font-semibold text-lg">Your family's digital heritage vault.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!otpSent ? (
            <div className="space-y-2">
              <label className="text-xs font-black text-orange-900 uppercase tracking-widest px-1">Mobile Number</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-600 font-bold border-r border-orange-200 pr-3">
                  +91
                </div>
                <input 
                  type="tel"
                  placeholder="9876543210"
                  className="w-full bg-white rounded-3xl py-6 pl-20 pr-6 font-bold text-xl outline-none focus:ring-4 focus:ring-orange-100 border-2 border-orange-100 text-gray-900 placeholder:text-gray-300 shadow-sm"
                  value={phone}
                  onChange={handlePhoneChange}
                  disabled={isSendingOtp}
                  required
                />
              </div>
              {error && <p className="text-red-600 text-sm font-bold px-2">{error}</p>}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <p className="text-sm font-black text-orange-900 uppercase tracking-widest">Verify OTP</p>
                <button type="button" onClick={() => { setOtpSent(false); setOtp(''); }} className="text-orange-600 text-xs font-black underline">Change Number</button>
              </div>
              <div className="flex justify-between gap-2">
                {[...Array(6)].map((_, i) => (
                  <input 
                    key={i}
                    type="text" 
                    maxLength={1}
                    className="w-full h-14 bg-white rounded-2xl text-center text-xl font-black text-gray-900 border-2 border-orange-100 outline-none focus:ring-4 focus:ring-orange-100 shadow-sm"
                    value={otp[i] || ''}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val) {
                        const newOtp = otp.split('');
                        newOtp[i] = val;
                        const finalOtp = newOtp.join('').slice(0, 6);
                        setOtp(finalOtp);
                        if (i < 5) {
                          const next = e.target.nextSibling as HTMLInputElement;
                          next?.focus();
                        }
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !otp[i] && i > 0) {
                        const prev = e.currentTarget.previousSibling as HTMLInputElement;
                        prev?.focus();
                      }
                    }}
                  />
                ))}
              </div>
              <div className="text-center">
                <p className="text-xs text-orange-900/40 font-bold">Didn't receive code? <button type="button" onClick={generateAndSendOtp} className="text-orange-600">Resend</button></p>
              </div>
              {error && <p className="text-red-600 text-sm font-bold px-2 text-center">{error}</p>}
            </div>
          )}

          <button 
            type="submit"
            disabled={isSendingOtp}
            className={`w-full py-6 bg-orange-700 text-white rounded-3xl font-black text-xl shadow-xl shadow-orange-100 flex items-center justify-center space-x-3 active:scale-95 transition-transform ${isSendingOtp ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <span>{isSendingOtp ? 'Sending...' : otpSent ? 'Enter Vault' : 'Send OTP'}</span>
            {!isSendingOtp && <ArrowRight size={24} />}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-orange-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#FFFBF7] px-4 text-orange-900/40 font-bold">Or continue with</span></div>
          </div>

          <button 
            type="button"
            onClick={() => setShowGoogleChooser(true)}
            className="w-full py-5 bg-white border-2 border-orange-100 text-gray-800 rounded-3xl font-bold text-lg shadow-sm flex items-center justify-center space-x-4 active:scale-95 transition-transform"
          >
            <Chrome size={24} className="text-red-500" />
            <span>Sign up with Gmail account</span>
          </button>
        </form>
      </div>
      
      <p className="text-center text-gray-500 text-xs py-10 px-4 leading-relaxed font-medium">
        By entering, you agree to Ritva's <span className="underline text-orange-800 font-bold">Privacy Policy</span>. Your data is encrypted and accessible only to your family.
      </p>

      {/* Simulated Google Account Chooser */}
      {showGoogleChooser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Chrome size={20} className="text-blue-500" />
                <span className="font-bold text-gray-700">Choose an account</span>
              </div>
              <button onClick={() => setShowGoogleChooser(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-2">
              <button 
                onClick={() => handleGoogleLogin('rajesh.patil@gmail.com', 'Rajesh Patil')}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-black">RP</div>
                <div>
                  <p className="font-bold text-gray-950">Rajesh Patil</p>
                  <p className="text-sm text-gray-500">rajesh.patil@gmail.com</p>
                </div>
              </button>
              <button 
                onClick={() => handleGoogleLogin('sneha.p@gmail.com', 'Sneha Patil')}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-700 font-black">SP</div>
                <div>
                  <p className="font-bold text-gray-950">Sneha Patil</p>
                  <p className="text-sm text-gray-500">sneha.p@gmail.com</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
