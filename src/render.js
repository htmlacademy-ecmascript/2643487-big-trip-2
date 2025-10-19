import { createElement, replace } from './utils/dom-utils.js';

const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

function render(component, container, place = RenderPosition.BEFOREEND) {
  container.insertAdjacentElement(place, component.element);
}

export {RenderPosition, createElement, render, replace};
