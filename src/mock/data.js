
import {
  DESTINATION_COUNT,
  MAX_PHOTOS_PER_DEST,
  MIN_PHOTOS_PER_DEST,
  POINTS_COUNT,
  DAYS_RANGE_BEFORE,
  DAYS_RANGE_AFTER,
  MAX_POINT_DURATION_HOURS,
  MIN_POINT_PRICE,
  MAX_POINT_PRICE,
  OFFERS_PER_POINT_MAX,
  PHOTOS_POOL_COUNT,
  MS_IN_DAY,
  MS_IN_HOUR,
  TYPES as types,
  CITY_NAMES as cityNames,
  DESCRIPTIONS as descriptions,
} from '../const.js';

function generateDestinations(countDest = DESTINATION_COUNT) {
  return Array.from({ length: countDest }, (_, id) => {
    const name = cityNames[Math.floor(Math.random() * cityNames.length)];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const photosCount = Math.floor(Math.random() * (MAX_PHOTOS_PER_DEST - MIN_PHOTOS_PER_DEST + 1)) + MIN_PHOTOS_PER_DEST;
    return {
      id: id + 1,
      name,
      description,
      pictures: Array.from({ length: photosCount }, (__, idx) => ({
        src: `img/photos/${(idx % PHOTOS_POOL_COUNT) + 1}.jpg`,
        description: `${name} - photo ${idx + 1}`
      }))
    };
  });
}

const offerPool = {
  taxi:    [ { title: 'Order Uber', price: 20 }, { title: 'Upgrade to business class', price: 70 } ],
  bus:     [ { title: 'Choose seats', price: 5 } ],
  train:   [ { title: 'Travel by train', price: 40 } ],
  ship:    [ { title: 'Lunch on board', price: 30 } ],
  drive:   [ { title: 'Rent a car', price: 200 } ],
  flight:  [ { title: 'Add luggage', price: 50 }, { title: 'Switch to comfort', price: 80 } ],
  'check-in':   [ { title: 'Add breakfast', price: 50 } ],
  sightseeing:  [ { title: 'Book tickets', price: 40 }, { title: 'Lunch in city', price: 30 } ],
  restaurant:   [ { title: 'Reserve table', price: 30 }, { title: 'Wine pairing', price: 25 } ],
};

function generateOffersByType(offersSource) {
  let globalId = 1;
  return Object.entries(offersSource).map(([type, offerArr]) => ({
    type,
    offers: offerArr.map((offer) => ({ id: globalId++, ...offer }))
  }));
}

function randomDateBetween(startDate, endDate) {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  return new Date(startTime + Math.random() * (endTime - startTime));
}
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function getRandomElements(array, maxCountNum) {
  const count = Math.floor(Math.random() * (maxCountNum + 1));
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generatePoints(amount = POINTS_COUNT, allDestinations, allOffersByType) {
  return Array.from({ length: amount }, (_, i) => {
    const type = getRandomElement(types);
    const offersForType = allOffersByType.find((o) => o.type === type).offers;
    const selectedOffers = getRandomElements(offersForType, OFFERS_PER_POINT_MAX).map((o) => o.id);
    const destination = getRandomElement(allDestinations).id;
    const now = new Date();
    const dateFrom = randomDateBetween(
      new Date(now.getTime() - DAYS_RANGE_BEFORE * MS_IN_DAY),
      new Date(now.getTime() + DAYS_RANGE_AFTER * MS_IN_DAY)
    );
    const dateTo = new Date(dateFrom.getTime() + Math.floor(Math.random() * MAX_POINT_DURATION_HOURS + 1) * MS_IN_HOUR);
    return {
      id: String(i + 1),
      type,
      destination,
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
      basePrice: Math.floor(Math.random() * (MAX_POINT_PRICE - MIN_POINT_PRICE) + MIN_POINT_PRICE),
      offers: selectedOffers,
      isFavorite: Math.random() > 0.7
    };
  });
}

export const destinations = generateDestinations(DESTINATION_COUNT);
export const offersByType = generateOffersByType(offerPool);
export const points = generatePoints(POINTS_COUNT, destinations, offersByType);
