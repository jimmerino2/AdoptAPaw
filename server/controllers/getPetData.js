import Pet from "../models/Pet.js"; // Model

export const getPetData = async (req, res) => {
  // what data we wanna get (no data from frontend)
  // What database model we gonna access (pets model)
  // What we gonna change in the database (nothing)
  // What response we are gonna send back (petsData)

  // get all pets from the database
  const petsData = await Pet.find();

  // send back the data
  res.status(200).json(petsData);
};
