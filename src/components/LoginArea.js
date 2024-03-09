import React, { useState } from 'react';

function LoginArea({ loginState, onLoginStart, onCodeSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmitCode = (e) => {
    e.preventDefault();
    onCodeSuccess(code);
  };

  return (
    <div>
      {loginState === 'initial' && (
        <form>
          <input 
            type="tel"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button onClick={() => onLoginStart(phoneNumber)}>Login</button>
        </form>
      )}

      {loginState === 'waitingForCode' && (
        <form onSubmit={handleSubmitCode}>
          <input 
            type="text"
            placeholder="Enter OTP code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit">Verify</button>
        </form>
      )}

      {loginState === 'checkingCode' && (
        <div>Checking code...</div>
      )}

      {errorMessage && (
        <div className="error-message">{errorMessage}</div> 
      )}
    </div>
  );
}

export default LoginArea;
