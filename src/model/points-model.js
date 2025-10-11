import { points, destinations, offersByType } from '../mock/data.js';

export default class PointsModel {
  constructor() {
    this._points = points;
    this._destinations = destinations;
    this._offersByType = offersByType;
  }

  getPoints() {
    return this._points;
  }

  getDestinations() {
    return this._destinations;
  }

  getOffersByType() {
    return this._offersByType;
  }
}
