import { createElement } from '../render.js';
import { SECONDS_IN_DAY, SECONDS_IN_HOUR, SECONDS_IN_MINUTE, MONTH_DAY_SLICE_START, MONTH_DAY_SLICE_END } from '../const.js';

function formatHM(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function getPointDuration(dateFrom, dateTo) {
  if (!dateFrom || !dateTo) {
    return '';
  }
  const start = new Date(dateFrom);
  const end = new Date(dateTo);
  let diff = (end - start) / 1000;

  const days = Math.floor(diff / SECONDS_IN_DAY);
  diff -= days * SECONDS_IN_DAY;
  const hours = Math.floor(diff / SECONDS_IN_HOUR);
  diff -= hours * SECONDS_IN_HOUR;
  const minutes = Math.floor(diff / SECONDS_IN_MINUTE);

  let out = '';
  if (days > 0) {
    out += `${String(days).padStart(2, '0')}D `;
  }
  if (days > 0 || hours > 0) {
    out += `${String(hours).padStart(2, '0')}H `;
  }
  out += `${String(minutes).padStart(2, '0')}M`;
  return out.trim();
}

function createPointTemplate(point, destinations, offersByType) {

  const safeDestinations = Array.isArray(destinations) ? destinations : [];
  const safeOffersByType = Array.isArray(offersByType) ? offersByType : [];

  const destinationObj = safeDestinations.find((dest) => dest.id === point.destination);
  const city = destinationObj ? destinationObj.name : '';
  const offersForType = safeOffersByType.find((o) => o.type === point.type)?.offers || [];
  const selectedOffers = offersForType.filter((offer) => point.offers.includes(offer.id));

  const dateFrom = formatHM(point.dateFrom);
  const dateTo = formatHM(point.dateTo);
  const duration = getPointDuration(point.dateFrom, point.dateTo);
  const dateStringMD = point.dateFrom.slice(MONTH_DAY_SLICE_START, MONTH_DAY_SLICE_END);

  return `
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${point.dateFrom}">${dateStringMD}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${point.type.charAt(0).toUpperCase() + point.type.slice(1)} ${city}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time">${dateFrom}</time>
            &mdash;
            <time class="event__end-time">${dateTo}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${selectedOffers.map((offer) => `
            <li class="event__offer">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
            </li>
          `).join('')}
        </ul>
        <button class="event__favorite-btn${point.isFavorite ? ' event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `;
}

export default class PointView {
  constructor(point, destinations, offersByType) {
    this.point = point;
    this.destinations = destinations;
    this.offersByType = offersByType;
  }

  getTemplate() {
    return createPointTemplate(this.point, this.destinations, this.offersByType);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
