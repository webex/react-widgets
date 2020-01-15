import {
  setDisplayName,
  wrapDisplayName
} from 'recompose';

export function setWrappedDisplayName(name) {
  return (BaseComponent) =>
    setDisplayName(
      wrapDisplayName(BaseComponent.WrappedComponent || BaseComponent, name)
    )(BaseComponent);
}

export default {};
