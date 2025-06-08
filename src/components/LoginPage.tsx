import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function LoginPage() {
  const { login, register, verifyOTP, isLoginLoading, isRegisterLoading, isOTPLoading, loginError, registerError, otpError } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    aadhaarNumber: '',
    phoneNumber: '',
    otp: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (showOTP) {
      verifyOTP({ email: formData.email, otp: formData.otp });
      return;
    }

    if (isRegistering) {
      register(formData);
    } else {
      login({ username: formData.username, password: formData.password });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          {showOTP ? 'Enter OTP' : isRegistering ? 'Create Account' : 'Login'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {showOTP ? (
            <div>
              <label className="block text-gray-300 mb-2">OTP</label>
              <input
                type="text"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:outline-none"
                placeholder="Enter OTP"
                required
              />
        </div>
          ) : (
            <>
              {isRegistering && (
                  <>
                    <div>
                    <label className="block text-gray-300 mb-2">Full Name</label>
                    <input
                        type="text"
                        value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:outline-none"
                        placeholder="Enter your full name"
                      required
                      />
                    </div>
                    <div>
                    <label className="block text-gray-300 mb-2">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:outline-none"
                      placeholder="Enter your email"
                      required
                      />
                    </div>
                    <div>
                    <label className="block text-gray-300 mb-2">Aadhaar Number</label>
                    <input
                        type="text"
                        value={formData.aadhaarNumber}
                      onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:outline-none"
                      placeholder="Enter your Aadhaar number"
                      required
                      />
                    </div>
                    <div>
                    <label className="block text-gray-300 mb-2">Phone Number</label>
                    <input
                        type="tel"
                        value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:outline-none"
                      placeholder="Enter your phone number"
                      required
                      />
                    </div>
                  </>
                )}
                <div>
                <label className="block text-gray-300 mb-2">Username</label>
                <input
                    type="text"
                    value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:outline-none"
                  placeholder="Enter your username"
                    required
                  />
                </div>
                <div>
                <label className="block text-gray-300 mb-2">Password</label>
                <input
                    type="password"
                    value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:outline-none"
                  placeholder="Enter your password"
                    required
                  />
                </div>
            </>
          )}

          <button
                  type="submit" 
            disabled={isLoginLoading || isRegisterLoading || isOTPLoading}
            className="w-full bg-yellow-400 text-gray-900 py-2 px-4 rounded font-semibold hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoginLoading || isRegisterLoading || isOTPLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : showOTP ? 'Verify OTP' : isRegistering ? 'Register' : 'Login'}
          </button>
                
          {!showOTP && (
            <button
                  type="button" 
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full text-gray-300 hover:text-yellow-400 mt-2"
                  >
              {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
            </button>
            )}

            {(loginError || registerError || otpError) && (
            <div className="text-red-400 text-sm mt-2">
                {loginError?.message || registerError?.message || otpError?.message}
              </div>
            )}
        </form>
      </div>
    </div>
  );
}
