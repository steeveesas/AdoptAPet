class PetCard {
	
	//First argument is a pet object from the search results, the second is the pet details from the pet details results
	constructor (petInfoFromSearchResults, petDetails){
		this.setPetInfo(petInfoFromSearchResults);
		this.setPetDetails(petDetails);
	}

	//This is the basic info returned from the searchResults of all pets
	setPetInfo(petInfoFromSearchResults){	        
		this.pet_id = petInfoFromSearchResults.pet_id;
        this.name = petInfoFromSearchResults.pet_name;
        this.pic = petInfoFromSearchResults.large_results_photo_url; //pet.results_photo_url;
        this.sex = petInfoFromSearchResults.sex;
        this.age = petInfoFromSearchResults.age || "";
        this.addr_city = petInfoFromSearchResults.addr_city;
        this.addr_state_code = petInfoFromSearchResults.addr_state_code;
        this.primary_breed = petInfoFromSearchResults.primary_breed;
        this.secondary_breed = petInfoFromSearchResults.secondary_breed;

		//Additional useful fields to make viewing data easier
		this.setCombinedBreed();
		this.setCityStateCombo();	
			
		//Mock this up since it isn't returned from server
        this.adopted_status = randomize(this.pet_id);
	}

	//This is the petDetails provided by the petDetails API call
	setPetDetails(petDetails){	
        this.special_needs = randomize(this.pet_id);//petDetails.special_needs;
        this.act_quickly = randomize(this.pet_id-1);//petDetails.act_quickly;

		//Additional useful fields to make viewing data easier
		this.setPetSexAgeCombo();
	}

	//Combines breeds for easy viewing on pet card
	setCombinedBreed(){
        if(this.secondary_breed != null)
			this.combined_breed = this.primary_breed + "/" + this.secondary_breed;
		else
			this.combined_breed = this.primary_breed;
	}

	setPetSexAgeCombo(){
		this.sex_age_combo = "";
		if(this.sex != null)
			this.sex_age_combo = this.sex === 'm' ? "Male" : "Female";
		if(this.age != null && this.age != ""){
			this.sex_age_combo = this.sex_age_combo + ", " + capitalizeFirstLetter(this.age);
		}
		//Add comma for special needs if it exists so we can keep the style the same in the div in the html for this text and not the red special needs text
		if(this.special_needs != null && this.special_needs != ""){
			this.sex_age_combo = this.sex_age_combo + ", ";
		}
	}

	//Combines city and state into one easy to view pet card
	setCityStateCombo(){
		this.city_state_combo = this.addr_city + ", " + this.addr_state_code;
	}

}
