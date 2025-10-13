
export const DESTINATION_COUNT = 6;
export const MAX_PHOTOS_PER_DEST = 4;
export const MIN_PHOTOS_PER_DEST = 1;
export const POINTS_COUNT = 3;
export const DAYS_RANGE_BEFORE = 5;
export const DAYS_RANGE_AFTER = 5;
export const MAX_POINT_DURATION_HOURS = 24;
export const MIN_POINT_PRICE = 50;
export const MAX_POINT_PRICE = 1000;
export const OFFERS_PER_POINT_MAX = 5;
export const PHOTOS_POOL_COUNT = 5;
export const MS_IN_DAY = 24 * 60 * 60 * 1000;
export const MS_IN_HOUR = 60 * 60 * 1000;


export const SECONDS_IN_DAY = 86400;
export const SECONDS_IN_HOUR = 3600;
export const SECONDS_IN_MINUTE = 60;

export const TYPES = [
  'taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'
];

export const CITY_NAMES = [
  'Amsterdam','Geneva','Chamonix','Moscow','New York','Saint Petersburg','London'
];

export const DESCRIPTIONS = [
  'A beautiful place with rich history.',
  'Perfect city for sightseeing and culture.',
  'Lots of attractions and great food.',
  'Known for its nightlife and events.',
  'Picturesque location by the water.',
  'Amazing mountains and lakes.',
  'Colorful streets and cozy cafes.'
];

export const FILTERS = [
  {type: 'everything', name: 'Everything'},
  {type: 'future', name: 'Future'},
  {type: 'present', name: 'Present'},
  {type: 'past', name: 'Past'},
];

export const SORT_TYPES = [
  {type: 'day', name: 'Day', disabled: false},
  {type: 'event', name: 'Event', disabled: true},
  {type: 'time', name: 'Time', disabled: false},
  {type: 'price', name: 'Price', disabled: false},
  {type: 'offer', name: 'Offers', disabled: true},
];

export const MONTH_DAY_SLICE_START = 5;
export const MONTH_DAY_SLICE_END = 10;
