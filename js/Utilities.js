//A Utility class for miscellaneous functions

//Since the server doesn't tells us if the pet is adopted or not, we randomly pick adopted or available to mock up the data.
function randomize(pet_id){
    return Math.round(Math.random());
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}