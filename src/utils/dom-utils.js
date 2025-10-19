// Вспомогательные функции для DOM
export function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;
  return newElement.firstElementChild;
}

export function replace(newComponent, oldComponent) {
  const newElement = newComponent.element;
  const oldElement = oldComponent.element;
  const parent = oldElement.parentElement;
  if (parent && newElement && oldElement) {
    parent.replaceChild(newElement, oldElement);
  }
}

export function escKeyDownHandler(evt, callback) {
  if (evt.key === 'Escape') {
    callback();
  }
}
