import { createElement } from '../render.js';

function formatInputDate(dateString) {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yy} ${hh}:${min}`;
}

function createEditPointFormTemplate(point, destinations, offersByType) {
  if (!point) {
    return '<form class="event event--edit"></form>';
  }
  const safeDestinations = Array.isArray(destinations) ? destinations : [];
  const safeOffersByType = Array.isArray(offersByType) ? offersByType : [];
  const destinationObj = safeDestinations.find((dest) => dest.id === point.destination);
  const allOffersForType = safeOffersByType.find((o) => o.type === point.type)?.offers || [];
  const selectedOffers = point.offers || [];
  const eventTypes = offersByType.map(({type}) => type);
  const destinationOptions = safeDestinations.map((dest) => `<option value="${dest.name}"></option>`).join('');
  const startInputValue = formatInputDate(point.dateFrom);
  const endInputValue = formatInputDate(point.dateTo);
  const offersSection = allOffersForType.length ? `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${allOffersForType.map((offer) => `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}"${selectedOffers.includes(offer.id) ? ' checked' : ''}>
            <label class="event__offer-label" for="event-offer-${offer.id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
            </label>
          </div>
        `).join('')}
      </div>
    </section>
  ` : '';
  const destinationSection = destinationObj ? `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationObj.description}</p>
      ${destinationObj.pictures && destinationObj.pictures.length ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${destinationObj.pictures.map((pic) => `<img class="event__photo" src="${pic.src}" alt="${pic.description}">`).join('')}
        </div>
      </div>` : ''}
    </section>` : '';
  const eventTypesMarkup = eventTypes.map((type) => `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}"${type === point.type ? ' checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
    </div>`).join('');
  return `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${eventTypesMarkup}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">${point.type.charAt(0).toUpperCase() + point.type.slice(1)}</label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationObj ? destinationObj.name : ''}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationOptions}
          </datalist>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startInputValue}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endInputValue}">
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${offersSection}
        ${destinationSection}
      </section>
    </form>
  `;
}

export default class EditPointFormView {
  constructor(point, destinations, offersByType) {
    this.point = point;
    this.destinations = destinations;
    this.offersByType = offersByType;
  }

  getTemplate() {
    return createEditPointFormTemplate(this.point, this.destinations, this.offersByType);
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
