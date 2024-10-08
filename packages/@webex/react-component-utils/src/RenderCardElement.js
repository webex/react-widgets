import ReactDOM from 'react-dom';

// eslint-disable-next-line import/prefer-default-export
export function renderCardElement(jsx, container, addChildNode) {
  ReactDOM.render(jsx, container);
  if (addChildNode && typeof addChildNode === 'function') {
    addChildNode(container);
  }
}
