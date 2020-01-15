import {deconstructHydraId} from '@webex/react-component-utils';

export function normalizePersonResult(rawPerson) {
  const person = {
    ...rawPerson,
    id: deconstructHydraId(rawPerson.id).id,
    name: rawPerson.name ? rawPerson.name : rawPerson.displayName
  };

  return person;
}

export default {};
