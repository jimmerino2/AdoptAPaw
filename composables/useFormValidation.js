export function useFormValidation() {
  const valName = (name) => {
    const nameRegex = /^[a-zA-Z_ ]{6,30}$/;
    return nameRegex.test(name.trim());
  };

  const valEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const valContact = (contactNo) => {
    const phoneRegex = /^(?:\+?60|0)[1-9][0-9]{7,11}$/;
    return phoneRegex.test(contactNo);
  };

  const valCity = (city) => {
    const cityRegex = /^[A-Za-z_ ]{3,}$/;
    return cityRegex.test(city.trim());
  };

  const valAddress = (address) => {
    const addressRegex =
      /^[a-zA-Z0-9\s,.'/-]+(?:\s+[a-zA-Z0-9\s,.'/-]+)*(?:,\s*\d{5})?$/;
    return addressRegex.test(address.trim());
  };

  const valDesc = (desc) => {
    const descRegex =
      /^[a-zA-Z0-9\s.,'"/!@#$%^&*()_+\-=\[\]{}|;:<>?`~]{1,300}$/;
    return descRegex.test(desc.trim());
  };

  const valPassNo = (passno) => {
    const passRegex = /^(?:\d{6}-\d{2}-\d{4}|[a-zA-Z0-9]{6,20})$/;
    return passRegex.test(passno.trim());
  };

  return {
    valName,
    valEmail,
    valContact,
    valCity,
    valAddress,
    valDesc,
    valPassNo,
  };
}
