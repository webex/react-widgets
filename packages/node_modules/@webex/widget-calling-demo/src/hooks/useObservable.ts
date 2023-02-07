import { useState, useEffect } from 'react';
import { Observable } from 'rxjs';

/**
 * @param observable
 * @param onNext
 * @param onError
 */
export function useObservable(
  observable: Observable<any>,
  onNext: (val: any) => void,
  onError?: (val: any) => void
) {
  const [value, setValue] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const subscription = observable.subscribe({
      next: (val: any) => {
        if (onNext) {
          return onNext(val);
        }
        return setValue(val);
      },
      error: onError || setError,
      complete: () => console.info('complete'),
    });

    return () => subscription.unsubscribe();
  }, [observable, onNext, onError]);

  return [error, value];
}
