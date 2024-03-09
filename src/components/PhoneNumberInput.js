import React, { useState } from 'react';

function PhoneNumberInput({ onLoginStart }) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginStart(phoneNumber);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="phone-number">Enter your phone number:</label>
      <input
        type="tel"
        id="phone-number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <button type="submit">Start Login</button>
    </form>
  );
}

export default PhoneNumberInput;
