import {base64} from '@ciscospark/common';

export function constructHydraId(type, id) {
  return base64.encode(`ciscospark://us/${type.toUpperCase()}/${id}`);
}
