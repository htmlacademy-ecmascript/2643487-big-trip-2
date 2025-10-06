import { render, RenderPosition } from '../render.js';
import FilterView from '../view/filter-view.js';
import SortView from '../view/sort-view.js';
import AddPointFormView from '../view/add-point-form-view.js';
import EditPointFormView from '../view/edit-point-form-view.js';
import PointView from '../view/point-view.js';
import PointsListView from '../view/points-list-view.js';

export default class TripPresenter {
  constructor({ filterContainer, sortContainer }) {
    this.filterContainer = filterContainer;
    this.sortContainer = sortContainer;
    this.pointsListComponent = new PointsListView();
  }

  init() {
    // Фильтры
    render(new FilterView(), this.filterContainer);
    // Сортировка
    render(new SortView(), this.sortContainer, RenderPosition.AFTERBEGIN);
    // Контейнер для точек маршрута
    render(this.pointsListComponent, this.sortContainer);
    // Форма редактирования
    render(new EditPointFormView(), this.pointsListComponent.getElement());
    // Форма добавления
    render(new AddPointFormView(), this.pointsListComponent.getElement());
    // Три точки маршрута
    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.pointsListComponent.getElement());
    }
  }
}
