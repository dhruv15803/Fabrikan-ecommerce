export const isStrongPassword = (password: string): boolean => {
  // for a password to be strong , should have 1 special char (@#$%y),  1 uppercase char,
  // special char
  const specialChars = "@#$%&!";
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let isSpecialChar = false;
  let isUppercaseChar = false;
  for (let i = 0; i < specialChars.length; i++) {
    if (password.includes(specialChars[i])) {
      isSpecialChar = true;
      break;
    }
  }
  for (let i = 0; i < upperCaseChars.length; i++) {
    if (password.includes(upperCaseChars[i])) {
      isUppercaseChar = true;
      break;
    }
  }
  return isSpecialChar && isUppercaseChar;
};
