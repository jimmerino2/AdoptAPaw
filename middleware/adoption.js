export default defineNuxtRouteMiddleware((to) => {
  const selectedPetId = to.query.petId; // Get PetID

  if (!selectedPetId) {
    return navigateTo("/homepage");
  }
});
