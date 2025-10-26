import { render, RenderPosition } from '../render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import PointsListView from '../view/points-list-view.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  constructor({ filterContainer, sortContainer, model }) {
    this.filterContainer = filterContainer;
    this.sortContainer = sortContainer;
    this.model = model;
    this.pointsListComponent = new PointsListView();
    this.pointPresenters = [];
  }

  init() {
    render(new FilterView(), this.filterContainer);
    render(new SortView(), this.sortContainer, RenderPosition.AFTERBEGIN);

    const points = this.model.getPoints();
    const destinations = this.model.getDestinations();
    const offersByType = this.model.getOffersByType();

    if (!points.length) {
      const emptyMsg = 'Click New Event to create your first point';
      render(new PointsListView({ emptyMessage: emptyMsg }), this.sortContainer);
      return;
    }

    this.pointsListComponent = new PointsListView();
    render(this.pointsListComponent, this.sortContainer);

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

  resetAllToView() {
    this.pointPresenters.forEach((presenter) => presenter.resetView());
  }

  updatePoint(updatedPoint) {
    const idx = this.model._points.findIndex((p) => p.id === updatedPoint.id);
    if (idx !== -1) {
      this.model._points[idx] = updatedPoint;
      const pointPresenter = this.pointPresenters[idx];
      pointPresenter.update(updatedPoint);
    }
  }
}
