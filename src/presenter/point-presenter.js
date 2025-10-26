import { render, replace } from '../render.js';
import PointView from '../view/point-view.js';
import EditPointFormView from '../view/edit-point-form-view.js';
import { escKeyDownHandler } from '../utils/dom-utils.js';

export default class PointPresenter {
  constructor({ container, point, destinations, offersByType, onFavoriteToggle, onEditStart }) {
    this.container = container;
    this.point = point;
    this.destinations = destinations;
    this.offersByType = offersByType;
    this.editComponent = null;
    this.pointComponent = null;
    this.onFavoriteToggle = onFavoriteToggle;
    this.onEditStart = onEditStart;
    this.isEditing = false;
    // Бинды, чтобы не терять this
    this.replaceFormToPoint = this.replaceFormToPoint.bind(this);
    this.replacePointToForm = this.replacePointToForm.bind(this);
  }

  init() {
    this.editComponent = new EditPointFormView(
      this.point,
      this.destinations,
      this.offersByType,
      {
        onFormSubmit: (evt) => {
          evt.preventDefault();
          this.replaceFormToPoint();
        },
        onRollupClick: this.replaceFormToPoint
      }
    );

    this.pointComponent = new PointView(
      this.point,
      this.destinations,
      this.offersByType,
      {
        onRollupClick: this.replacePointToForm,
        onFavoriteClick: this.#handleFavoriteClick.bind(this)
      }
    );

    this.pointComponent.setRollupButtonClickHandler(this.replacePointToForm);
    this.pointComponent.setFavoriteButtonClickHandler(this.#handleFavoriteClick.bind(this));
    this.editComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      this.replaceFormToPoint();
    });
    this.editComponent.setRollupButtonClickHandler(this.replaceFormToPoint);

    render(this.pointComponent, this.container);
  }

  update(point) {
    this.point = point;
    const oldComponent = this.pointComponent;
    this.pointComponent = new PointView(
      this.point,
      this.destinations,
      this.offersByType,
      {
        onRollupClick: this.replacePointToForm,
        onFavoriteClick: this.#handleFavoriteClick.bind(this)
      }
    );
    this.pointComponent.setRollupButtonClickHandler(this.replacePointToForm);
    this.pointComponent.setFavoriteButtonClickHandler(this.#handleFavoriteClick.bind(this));
    replace(this.pointComponent, oldComponent);
    this.isEditing = false;
  }

  resetView() {
    if (this.isEditing) {
      this.replaceFormToPoint();
    }
  }

  replaceFormToPoint() {
    replace(this.pointComponent, this.editComponent);
    this.isEditing = false;
  }

  replacePointToForm() {
    if (this.onEditStart) {
      this.onEditStart();
    }
    replace(this.editComponent, this.pointComponent);
    document.addEventListener('keydown', (evt) => escKeyDownHandler(evt, this.replaceFormToPoint));
    this.isEditing = true;
  }

  #handleFavoriteClick(evt) {
    evt.preventDefault();
    const updatedPoint = { ...this.point, isFavorite: !this.point.isFavorite };
    if (this.onFavoriteToggle) {
      this.onFavoriteToggle(updatedPoint);
    }
  }
}
