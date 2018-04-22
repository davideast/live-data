import { 
  firebaseApp, 
  firestore, 
  restaurantsIndexRef, 
  restaurantsRef } from './firebase.init';

const config = require('./seed.config.json');
const localBatch = {
  restaurantsIndex: {}
};

/**
 * Seed the database from the json file. Create an "index"
 * so you can access a "restaurants" by a random number
 */
function firestoreSeed() {
  const batch = firestore.batch();
  Object.keys(config.restaurants).forEach((key, i) => {
    const restaurant = config.restaurants[key];
    batch.set(restaurantsRef.doc(key), restaurant);
    batch.set(restaurantsIndexRef.doc(i.toString()), restaurant);
  });
  batch.commit();
}

export function localSeed() {
  const restaurantsIndex = {};
  const restaurantKeys = Object.keys(config.restaurants);
  restaurantKeys.forEach((key, i) => {
    const restaurant = config.restaurants[key];
    restaurant.id = key;
    restaurantsIndex[i] = restaurant;
  });
  return {
    restaurantsIndex,
    restaurants: config.restaurants,
    size: restaurantKeys.length,
    keys: restaurantKeys
  };
}
