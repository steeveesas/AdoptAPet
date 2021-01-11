class PetSearch {
    
    constructor(){
        //The number of pet details calls we need to make based on the results that come back
        this.num_pet_details_calls_to_make;
        //This variable keep track of how many times we've received a response for the pet details calls. That way we can show all the pet results at once when all calls have returned
        this.num_pet_details_calls_made;  
    }      
    
    //This function runs a pet search by calling the Adopt-A-Pet API
    //petData is the variable from the calling function that when we update it Alpine will update the UI components with the new data
    petSearch(zip_code, radius, petData){
        
       //Reset array in case this same search is run on the same object instance
       petData.petArray.length = 0;

       var url = this.getUrl(zip_code, radius);
       var petSearchInstance = this;
       fetch(url)
          .then(
               function(response) {
                    if (response.status !== 200) {
                        console.error('Looks like there was a problem searching for pets. Status Code: ' + response.status + " on url=" + url);
                        return;
                    }
                    response.json().then(function(petSearchResults) {
                        petSearchInstance.makePetDetailsCalls(petSearchResults, petData);
                    });
               }
          )
          .catch(function(err) {
               console.error('Fetch Error', err);
          });

    }

    //Iterates through the pets results and requests individual pet details
    makePetDetailsCalls(petSearchResults, petData){                            

        //Re-initialize our num_pet_details_calls ... for this test challenge the most we want is 6 per the guidance I was given
        this.num_pet_details_calls_to_make = Math.min(petSearchResults.returned_pets, MAX_PETS_IN_GRID);
        this.num_pet_details_calls_made = 0;                        
                        
        var i;
        for(i = 0; i < this.num_pet_details_calls_to_make; i++){
            this.petDetailsSearch(petSearchResults.pets[i], petData);
        }

    }

    //Calls the Adopt-A-Pet API for pet details
    petDetailsSearch(pet, petData){

       var petSearchInstance = this;
       var url = pet.details_url;
       fetch(url)
          .then(
               function(response) {
                    if (response.status !== 200) {
                        console.error('Looks like there was a problem searching for pet details for pet_id = " + pet.pet_id + ". Status Code: ' + response.status + " on url=" + url);  
                        //Whether the call fails or succeeds we want to let the grid know if it's time to show the user the pets                      
                        petSearchInstance.petDetailsSearchWrapUp(petData);
                        return;
                    }
                    response.json().then(function(petDetails) {
                        petData.petArray.push(new PetCard(pet, petDetails.pet));                        
                        petSearchInstance.petDetailsSearchWrapUp(petData);
                    });
               }
          )
          .catch(function(err) {
               console.error('Fetch Error', err);
               //Whether the call fails or succeeds we want to let the grid know if it's time to show the user the pets
               petSearchInstance.petDetailsSearchWrapUp(petData);
          });

    }
    
    //This function should be performed after every petDetailsSearch returns whether it succedded or failed
    petDetailsSearchWrapUp(petData){
        this.num_pet_details_calls_made++;
        if(this.num_pet_details_calls_made == this.num_pet_details_calls_to_make){
            petData.all_pet_calls_returned = true;
        }
    }
    
    getUrl(area_code, radius){   
        if(area_code != null && radius != null)
            return "https://api.adoptapet.com/search/pet_search?key=" + API_KEY + "&geo_range=" + radius + "&city_or_zip=" + area_code + "&species=dog&output=json";
        return DEFAULT_TEST_URL;
    }
 
}