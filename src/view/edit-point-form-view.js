import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

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

function createEditPointFormTemplate(state, destinations, offersByType) {
  if (!state) {
    return '<form class="event event--edit"></form>';
  }
  const safeDestinations = Array.isArray(destinations) ? destinations : [];
  const safeOffersByType = Array.isArray(offersByType) ? offersByType : [];
  const destinationObj = safeDestinations.find((dest) => dest.id === state.destination);
  const allOffersForType = safeOffersByType.find((o) => o.type === state.type)?.offers || [];
  const selectedOffers = state.offers || [];
  const eventTypes = offersByType.map(({type}) => type);
  const destinationOptions = safeDestinations.map((dest) => `<option value="${dest.name}"></option>`).join('');
  const startInputValue = formatInputDate(state.dateFrom);
  const endInputValue = formatInputDate(state.dateTo);
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
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}"${type === state.type ? ' checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type.charAt(0).toUpperCase() + type.slice(1)}</label>
    </div>`).join('');
  return `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${state.type}.png" alt="Event type icon">
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
          <label class="event__label  event__type-output" for="event-destination-1">${state.type.charAt(0).toUpperCase() + state.type.slice(1)}</label>
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
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${state.basePrice}">
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

export default class EditPointFormView extends AbstractStatefulView {
  constructor(point, destinations, offersByType, {onFormSubmit, onRollupClick} = {}) {
    super();
    this._state = {...point};
    this._destinations = destinations;
    this._offersByType = offersByType;
    this._onFormSubmit = onFormSubmit;
    this._onRollupClick = onRollupClick;
    this._flatpickrFrom = null;
    this._flatpickrTo = null;
    this._restoreHandlers();
  }

  get template() {
    return createEditPointFormTemplate(this._state, this._destinations, this._offersByType);
  }

  _restoreHandlers() {
    this.setFormSubmitHandler(this._onFormSubmit);
    this.setRollupButtonClickHandler(this._onRollupClick);
    // Смена типа точки
    this.element.querySelectorAll('input[name="event-type"]').forEach((input) => {
      input.addEventListener('change', this.#onTypeChange.bind(this));
    });
    // Смена пункта назначения
    this.element.querySelector('.event__input--destination')?.addEventListener('change', this.#onDestinationChange.bind(this));
    // flatpickr для дат
    this.#setDatepickers();
  }

  #setDatepickers() {
    if (this._flatpickrFrom) {
      this._flatpickrFrom.destroy();
    }
    if (this._flatpickrTo) {
      this._flatpickrTo.destroy();
    }
    const startInput = this.element.querySelector('#event-start-time-1');
    const endInput = this.element.querySelector('#event-end-time-1');
    this._flatpickrFrom = flatpickr(startInput, {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      defaultDate: this._state.dateFrom,
      onChange: ([selectedDate]) => {
        this.updateElement({ dateFrom: dayjs(selectedDate).toISOString() });
      }
    });
    this._flatpickrTo = flatpickr(endInput, {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      defaultDate: this._state.dateTo,
      onChange: ([selectedDate]) => {
        this.updateElement({ dateTo: dayjs(selectedDate).toISOString() });
      }
    });
  }

  #onTypeChange(evt) {
    const newType = evt.target.value;
    this.updateElement({ type: newType, offers: [] });
  }

  #onDestinationChange(evt) {
    const newDestName = evt.target.value;
    const foundDest = this._destinations.find((d) => d.name === newDestName);
    this.updateElement({ destination: foundDest ? foundDest.id : null });
  }

  setFormSubmitHandler(callback) {
    this._onFormSubmit = callback;
    this.element.querySelector('form')?.addEventListener('submit', this._onFormSubmit);
  }

  setRollupButtonClickHandler(callback) {
    this._onRollupClick = callback;
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this._onRollupClick);
  }
}
