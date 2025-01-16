export function usePetFormValidation() {
  const valName = (name) => {
    const regEx = /^[A-Za-z '-]{3,}$/;
    return regEx.test(name.trim());
  };

  const valType = (type) => {
    return type === "Cat" || type === "Dog" ? true : false;
  };

  const valBreed = (breed) => {
    const regEx = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
    return regEx.test(breed.trim());
  };

  const valGender = (gender) => {
    return gender === "Male" || gender === "Female" ? true : false;
  };

  const valAge = (age) => {
    return age > 0 && age < 24;
  };

  const valWeight = (weight) => {
    return weight > 0.5 && weight < 12;
  };

  const valPrice = (price) => {
    return price > 0;
  };

  const valBooleanSelect = (select) => {
    return select === "Yes" || select === "No" ? true : false;
  };

  const valDesc = (desc) => {
    const regEx = /^[A-Za-z1-9 ',".!?;:()&%$#@+=<>~*_/\\-]{0,500}$/;
    return regEx.test(desc);
  };

  const valPersonality = (persona) => {
    const list = [
      "affectionate",
      "curious",
      "energetic",
      "friendly",
      "gentle",
      "lazy",
      "loyal",
      "playful",
      "protective",
      "relaxed",
      "strong",
    ];
    return persona.every((element) => list.includes(element));
  };

  const valMedicalDate = (date) => {
    if (typeof date === "string") {
      date = new Date(date);
    }

    if (!(date instanceof Date) || isNaN(date)) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date < today;
  };

  return {
    valName,
    valType,
    valBreed,
    valGender,
    valAge,
    valWeight,
    valPrice,
    valBooleanSelect,
    valDesc,
    valPersonality,
    valMedicalDate,
  };
}
