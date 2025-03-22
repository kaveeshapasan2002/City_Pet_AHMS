// src/utils/validation.js
export const validateEmail = (email) => {
    const re = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return re.test(email);
  };
  
  export const validatePassword = (password) => {
    return password.length >= 6;
  };
  
  export const validatePhone = (phone) => {
    const re = /^\d{10}$/;
    return re.test(phone);
  };
  