import TripPresenter from './presenter/trip-presenter.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const sortContainer = document.querySelector('.trip-events');

const presenter = new TripPresenter({
  filterContainer,
  sortContainer
});

presenter.init();
