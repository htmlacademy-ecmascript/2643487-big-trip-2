import AbstractView from '../framework/view/abstract-view.js';

function createPointsListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

function createEmptyListTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class PointsListView extends AbstractView {
  constructor({ emptyMessage } = {}) {
    super();
    this.emptyMessage = emptyMessage;
  }

  get template() {
    if (this.emptyMessage) {
      return createEmptyListTemplate(this.emptyMessage);
    }
    return createPointsListTemplate();
  }
}
