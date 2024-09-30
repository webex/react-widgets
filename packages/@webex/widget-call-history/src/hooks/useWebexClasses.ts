import classNames from 'classnames';

const WEBEX_COMPONENTS_CLASS_PREFIX = 'wxc';

/**
 * Builds a string of css class names for webex components
 *
 * @param {string} classBaseName  Component class base name
 * @param {string} [userClassName]  Custom CSS class to apply
 * @param {object} otherClasses  Other optional classes with prefix
 * @returns {[string, Function]}  Classes and a prefix function
 */
export default function useWebexClasses(
  classBaseName: string,
  userClassName?: string,
  otherClasses?: {
    [key: string]: string | boolean;
  }
) {
  const userClassNames = Array.isArray(userClassName)
    ? userClassName
    : [userClassName];

  const cssClasses = classNames(
    'wxc',
    `${WEBEX_COMPONENTS_CLASS_PREFIX}-${classBaseName}`,
    ...userClassNames,
    {
      ...Object.fromEntries(
        Object.entries(otherClasses || {}).map(([key, val]) => [
          `${WEBEX_COMPONENTS_CLASS_PREFIX}-${classBaseName}--${key}`,
          val,
        ])
      ),
    }
  );

  const sc = (subclass: string, modifiers: string[] = []) => {
    const n = `${WEBEX_COMPONENTS_CLASS_PREFIX}-${classBaseName}__${subclass}`;

    return classNames(
      n,
      modifiers.map((m) => `${n}--${m}`)
    );
  };

  return [cssClasses, sc] as const;
}
