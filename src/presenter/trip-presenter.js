import { render, RenderPosition, replace } from '../render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import EditPointFormView from '../view/edit-point-form-view.js';
import PointsListView from '../view/points-list-view.js';
import { escKeyDownHandler } from '../utils/dom-utils.js';

export default class TripPresenter {
  constructor({ filterContainer, sortContainer, model }) {
    this.filterContainer = filterContainer;
    this.sortContainer = sortContainer;
    this.model = model;
    this.pointsListComponent = new PointsListView();
    this.editComponent = null;
    this.pointComponent = null;
  }

  init() {
    render(new FilterView(), this.filterContainer);
    render(new SortView(), this.sortContainer, RenderPosition.AFTERBEGIN);
    render(this.pointsListComponent, this.sortContainer);

    const points = this.model.getPoints();
    const destinations = this.model.getDestinations();
    const offersByType = this.model.getOffersByType();

    for (const point of points) {
      this.#renderPoint(point, destinations, offersByType);
    }
  }

  #renderPoint(point, destinations, offersByType) {
    let editComponent = null;
    let pointComponent = null;

    const replaceFormToPoint = () => {
      replace(pointComponent, editComponent);
      // В removeEventListener нельзя больше убирать обработчик, т.к. используем стрелочную и анонимку.
    };
    const replacePointToForm = () => {
      replace(editComponent, pointComponent);
      document.addEventListener('keydown', (evt) => escKeyDownHandler(evt, replaceFormToPoint));
    };

    editComponent = new EditPointFormView(point, destinations, offersByType, {
      onFormSubmit: (evt) => {
        evt.preventDefault();
        replaceFormToPoint();
      },
      onRollupClick: replaceFormToPoint
    });

    pointComponent = new PointView(point, destinations, offersByType, {
      onRollupClick: replacePointToForm
    });

    pointComponent.setRollupButtonClickHandler(replacePointToForm);
    editComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      replaceFormToPoint();
    });
    editComponent.setRollupButtonClickHandler(replaceFormToPoint);

    render(pointComponent, this.pointsListComponent.element);
    this.editComponent = editComponent;
    this.pointComponent = pointComponent;
  }
}
