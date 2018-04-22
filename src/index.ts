import { restaurantsRef } from './firebase.init';
import { Observable, timer, from, interval } from 'rxjs';
import { map, tap, switchMap, mergeAll } from 'rxjs/operators';
import { localSeed } from './seed';

const restaurantData = localSeed();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getIndexes() {
  const MAX = restaurantData.size - 1;
  const indexes: number[] = [
    getRandomInt(0, MAX),
    getRandomInt(0, MAX),
    getRandomInt(0, MAX),
    getRandomInt(0, MAX),
    getRandomInt(0, MAX),
    getRandomInt(0, MAX),
    getRandomInt(0, MAX),
    getRandomInt(0, MAX),
  ];
  return indexes
    .filter((item, pos) => indexes.indexOf(item) == pos)
    .map(i => restaurantData.restaurantsIndex[i]);
}

const sub = interval(2000).pipe(
  map(_ => getIndexes()),
  switchMap(restaurants => {
    return restaurants.map(r => restaurantsRef.doc(r.id).get());
  }),
  mergeAll(),
  map(doc => {
    const { occupants, capacity } = doc.data();
    const filled = (occupants / capacity) * 100;
    let occupantChange = getRandomInt(0, getRandomInt(2, 12));
    let newOccupants = 0;
    if(filled < 100) {
      // increase
      newOccupants = occupants + occupantChange;
    } else {
      // decrease
      newOccupants = occupants - occupantChange;
    }
    if(newOccupants < 0) {
      newOccupants = occupants;
    }
    return { newOccupants, doc }
  }),
  tap(meta => {
    meta.doc.ref.update({ occupants: meta.newOccupants })
  })
).subscribe(meta => {
  console.log(meta);
});
