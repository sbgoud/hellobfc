import React, { useState } from 'react';

function CodeVerification({ onCodeSuccess }) {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCodeSuccess(code);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="code">Enter verification code:</label>
      <input
        type="text"
        id="code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />
      <button type="submit">Verify</button>
    </form>
  );
}

export default CodeVerification;
