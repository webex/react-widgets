/**
 * Builds a string of css class names for webex components
 *
 * @param {string} classBaseName  Component class base name
 * @param {string} [userClassName]  Custom CSS class to apply
 * @param {object} otherClasses  Other optional classes with prefix
 * @returns {[string, Function]}  Classes and a prefix function
 */
export default function useWebexClasses(classBaseName: string, userClassName?: string, otherClasses?: {
    [key: string]: string | boolean;
}): readonly [string, (subclass: string, modifiers?: string[]) => string];
//# sourceMappingURL=useWebexClasses.d.ts.map