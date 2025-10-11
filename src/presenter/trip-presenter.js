import { render, RenderPosition } from '../render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import AddPointFormView from '../view/add-point-form-view.js';
import EditPointFormView from '../view/edit-point-form-view.js';
import PointView from '../view/point-view.js';
import PointsListView from '../view/points-list-view.js';

export default class TripPresenter {
  constructor({ filterContainer, sortContainer, model }) {
    this.filterContainer = filterContainer;
    this.sortContainer = sortContainer;
    this.model = model;
    this.pointsListComponent = new PointsListView();
  }

  init() {
    render(new FilterView(), this.filterContainer);
    render(new SortView(), this.sortContainer, RenderPosition.AFTERBEGIN);
    render(this.pointsListComponent, this.sortContainer);

    const points = this.model.getPoints();
    const destinations = this.model.getDestinations();
    const offersByType = this.model.getOffersByType();

    if (points.length > 0) {
      render(
        new EditPointFormView(points[0], destinations, offersByType),
        this.pointsListComponent.getElement()
      );
    }

    const blankPoint = {
      type: destinations[0] ? offersByType[0].type : 'taxi',
      destination: destinations[0]?.id || null,
      dateFrom: '',
      dateTo: '',
      basePrice: '',
      offers: [],
      isFavorite: false,
    };
    render(new AddPointFormView(blankPoint, destinations, offersByType), this.pointsListComponent.getElement());

    for (let i = 1; i < points.length; i++) {
      render(new PointView(points[i], destinations, offersByType), this.pointsListComponent.getElement());
    }
  }
}
