const fs = require('fs');
const Country = require('../../models/countryModel');
const State = require('../../models/stateModel');
const City = require('../../models/cityModel');

const data = JSON.parse(fs.readFileSync('./utils/india.json', 'utf8'));

async function addAllLocations() {
	let country, state, city;

	data.forEach(async (countryItem) => {
		const localCountry = {
			name: countryItem.name,
			slug: String(countryItem.name).toLowerCase().split(" ").join("-"),
			id: countryItem.id,
			latitude: countryItem.latitude,
			longitude: countryItem.longitude,
		};
		country = await Country.create(localCountry)
		// console.log(`${country} is created`);
		
		countryItem.states.forEach(async (stateItem) => {
			const localState = {
				id: stateItem.id,
				name: stateItem.name,
				slug: String(stateItem.name).toLowerCase().split(" ").join("-"),
				country_id: country._id,
				type: stateItem.type,
				latitude: stateItem.latitude,
				longitude: stateItem.longitude,
			};
			state = await State.create(localState);
			// console.log(`${state} is created`);
			
			stateItem.cities.forEach(async (cityItem) => {
				const localCity = {
					id: cityItem.id,
					country_id: country._id,
					state_id: state._id,
					name: cityItem.name,
					slug: String(cityItem.name).toLowerCase().split(" ").join("-"),
					latitude: cityItem.latitude,
					longitude: cityItem.longitude,
				};
				city = await City.create(localCity)
				// console.log(`${city} is created`);
			});
		});
	});
}

module.exports = addAllLocations;