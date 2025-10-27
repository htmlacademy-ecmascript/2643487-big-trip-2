import { render, RenderPosition } from '../render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import PointPresenter from './point-presenter.js';

const SORT_TYPE = {
  DAY: 'day',
  PRICE: 'price',
  TIME: 'time',
};

export default class TripPresenter {
  constructor({ filterContainer, sortContainer, model }) {
    this.filterContainer = filterContainer;
    this.sortContainer = sortContainer;
    this.model = model;
    this.pointsListComponent = new PointsListView();
    this.pointPresenters = [];
    this.currentSortType = SORT_TYPE.DAY;
    this.sortComponent = null;
  }

  init() {
    render(new FilterView(), this.filterContainer);
    this.sortComponent = new SortView();
    render(this.sortComponent, this.sortContainer, RenderPosition.AFTERBEGIN);
    this.sortComponent.setSortChangeHandler(this.handleSortChange.bind(this));

    this.renderPoints();
  }

  renderPoints() {
    const points = this.getSortedPoints();
    const destinations = this.model.getDestinations();
    const offersByType = this.model.getOffersByType();

    if (this.pointsListComponent.element.parentElement) {
      this.pointsListComponent.element.parentElement.removeChild(this.pointsListComponent.element);
    }
    this.pointsListComponent = new PointsListView();
    render(this.pointsListComponent, this.sortContainer);
    this.pointPresenters = [];

    if (!points.length) {
      const emptyMsg = 'Click New Event to create your first point';
      render(new PointsListView({ emptyMessage: emptyMsg }), this.sortContainer);
      return;
    }
    for (const point of points) {
      const pointPresenter = new PointPresenter({
        container: this.pointsListComponent.element,
        point,
        destinations,
        offersByType,
        onFavoriteToggle: this.updatePoint.bind(this),
        onEditStart: this.resetAllToView.bind(this)
      });
      pointPresenter.init();
      this.pointPresenters.push(pointPresenter);
    }
  }

  getSortedPoints() {
    const points = [...this.model.getPoints()];
    switch(this.currentSortType) {
      case SORT_TYPE.PRICE:
        return points.sort((a, b) => b.basePrice - a.basePrice);
      case SORT_TYPE.TIME:
        return points.sort((a, b) => {
          const aDuration = new Date(a.dateTo) - new Date(a.dateFrom);
          const bDuration = new Date(b.dateTo) - new Date(b.dateFrom);
          return bDuration - aDuration;
        });
      case SORT_TYPE.DAY:
      default:
        return points.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
    }
  }

  handleSortChange(sortType) {
    if (sortType === this.currentSortType) {
      return;
    }
    this.currentSortType = sortType;
    this.renderPoints();
  }

  resetAllToView() {
    this.pointPresenters.forEach((presenter) => presenter.resetView());
  }

  updatePoint(updatedPoint) {
    const idx = this.model._points.findIndex((p) => p.id === updatedPoint.id);
    if (idx !== -1) {
      this.model._points[idx] = updatedPoint;
      this.renderPoints();
    }
  }
}
