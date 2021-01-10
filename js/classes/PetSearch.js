class PetSearch {
    
    constructor(){
        //The number of pet details calls we need to make based on the results that come back
        this.num_pet_details_calls_to_make;
        //This variable keep track of how many times we've received a response for the pet details calls. That way we can show all the pet results at once when all calls have returned
        this.num_pet_details_calls_made;  
    }      

    //petData is the variable from the calling function that when we update it Alpine will update the UI components with the new data
    petSearch(area_code, radius, petData){            
        
        var petSearchInstance = this;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                try{
                    var petSearchResults = JSON.parse(this.responseText);
                }                
                catch(e){
                    console.error('There was an error parsing json in the pet search');
                    return ;
                }
                console.log("Found " + petSearchResults.returned_pets + " pets.");
                        
                //Before we can populate our pet cards, we need a little more information for each pet that can only be gotten from the
                //petDetails call. So now we'll make one call per pet in the results list or the first 6 pets if there are more than 6 pets returned

                //Re-initialize our num_pet_details_calls
                petSearchInstance.num_pet_details_calls_to_make = Math.min(petSearchResults.returned_pets, MAX_PETS_IN_GRID);
                petSearchInstance.num_pet_details_calls_made = 0;                        
                        
                var i;
                for(i = 0; i < petSearchInstance.num_pet_details_calls_to_make; i++){
                    petSearchInstance.petDetails(petSearchResults.pets[i], petData);
                }
            }
            else if(this.readyState == 4 && this.status != 200){
                console.error("Error during pet search, status code: " + this.status);
            }
        };

        xmlhttp.open("GET", this.getUrl(area_code, radius), true);
        xmlhttp.send();

    }

    petDetails(pet, petData){

        console.log("Calling pet deails for pet_id = " + pet.pet_id);
        var petSearchInstance = this;
        
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4){
                if(this.status == 200) {
                    try{
                        var petDetails = JSON.parse(this.responseText);
                        petData.petArray.push(new PetCard(pet, petDetails.pet));
                    }
                    catch(e){
                        console.error('There was an error parsing pet details json for pet id = ' + pet.pet_id);
                    }
                }
                else{
                    console.error('Error during pet details call: Status code: ' + this.status);      
                }
                    
                //Whether the call fails or succeeds we want to let the grid know if it's time to show the user the pets
                petSearchInstance.num_pet_details_calls_made++;
                if(petSearchInstance.num_pet_details_calls_made == petSearchInstance.num_pet_details_calls_to_make){
                    petData.all_pet_calls_returned = true;
                }
            }
        };

        xmlhttp.open("GET", pet.details_url, true);
        xmlhttp.send();

    }
    
    getUrl(area_code, radius){   
        if(area_code != null && radius != null)
            return "https://api.adoptapet.com/search/pet_search?key=" + API_KEY + "&geo_range=" + radius + "&city_or_zip=" + area_code + "&species=dog&output=json";
        return DEFAULT_TEST_URL;
    }
 
}