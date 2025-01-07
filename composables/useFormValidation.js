export function useFormValidation() {
  const valName = (name) => {
    const nameRegex = /^[a-zA-Z_ ]{6,30}$/;
    return nameRegex.test(name);
  };

  const valEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const valContact = (contactNo) => {
    const phoneRegex = /^(?:\+?60|0)[1-9][0-9]{7,11}$/;
    return phoneRegex.test(contactNo);
  };

  const valCity = (city) => {
    const cityRegex = /^[A-Za-z_ ]{3,}$/;
    return cityRegex.test(city);
  };

  const valAddress = (address) => {
    const addressRegex =
      /^[a-zA-Z0-9\s,.'/-]+(?:\s+[a-zA-Z0-9\s,.'/-]+)*(?:,\s*\d{5})?$/;
    return addressRegex.test(address);
  };

  const valDesc = (desc) => {
    const descRegex =
      /^[a-zA-Z0-9\s.,'"/!@#$%^&*()_+\-=\[\]{}|;:<>?`~]{1,300}$/;
    return descRegex.test(desc);
  };

  const valPassNo = (passno) => {
    const passRegex = /^(?:\d{6}-\d{2}-\d{4}|[a-zA-Z0-9]{6,20})$/;
    return passRegex.test(passno);
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
