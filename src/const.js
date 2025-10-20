
const DESTINATION_COUNT = 4;
const MAX_PHOTOS_PER_DEST = 4;
const MIN_PHOTOS_PER_DEST = 1;
const POINTS_COUNT = 8;
const DAYS_RANGE_BEFORE = 5;
const DAYS_RANGE_AFTER = 5;
const MAX_POINT_DURATION_HOURS = 24;
const MIN_POINT_PRICE = 50;
const MAX_POINT_PRICE = 1000;
const OFFERS_PER_POINT_MAX = 5;
const PHOTOS_POOL_COUNT = 5;
const MS_IN_DAY = 24 * 60 * 60 * 1000;
const MS_IN_HOUR = 60 * 60 * 1000;

const SECONDS_IN_DAY = 86400;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;

const TYPES = [
  'taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'
];

const CITY_NAMES = [
  'Amsterdam','Geneva','Chamonix','Moscow','New York','Saint Petersburg','London'
];

const DESCRIPTIONS = [
  'A beautiful place with rich history.',
  'Perfect city for sightseeing and culture.',
  'Lots of attractions and great food.',
  'Known for its nightlife and events.',
  'Picturesque location by the water.',
  'Amazing mountains and lakes.',
  'Colorful streets and cozy cafes.'
];

const FILTERS = [
  {type: 'everything', name: 'Everything'},
  {type: 'future', name: 'Future'},
  {type: 'present', name: 'Present'},
  {type: 'past', name: 'Past'},
];

const SORT_TYPES = [
  {type: 'day', name: 'Day', disabled: false},
  {type: 'event', name: 'Event', disabled: true},
  {type: 'time', name: 'Time', disabled: false},
  {type: 'price', name: 'Price', disabled: false},
  {type: 'offer', name: 'Offers', disabled: true},
];

const MONTH_DAY_SLICE_START = 5;
const MONTH_DAY_SLICE_END = 10;

export {
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
  SECONDS_IN_DAY,
  SECONDS_IN_HOUR,
  SECONDS_IN_MINUTE,
  TYPES,
  CITY_NAMES,
  DESCRIPTIONS,
  FILTERS,
  SORT_TYPES,
  MONTH_DAY_SLICE_START,
  MONTH_DAY_SLICE_END
};
