export function useFormValidation() {
  const valContact = (contactNo) => {
    const phoneRegex = /^[0-9]{10,15}$/; // Contact should be 10 to 15 digits long
    return phoneRegex.test(contactNo);
  };

  return { valContact };
}
