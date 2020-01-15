import withSparkMetrics from './withSparkMetrics';

export {default} from './reducer';
export {default as events} from './metrics-events';
export {withSparkMetrics};


export function injectSparkMetrics(WrappedComponent, widgetName) {
  return withSparkMetrics(widgetName)(WrappedComponent);
}
