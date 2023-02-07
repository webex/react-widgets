import {
  ISearchContactsAdapter,
  ISearchContactsAdapterSearchInput,
  ISearchContactsAdapterSearchResponse,
  IWebexIntContact,
} from '@webex-int/adapter-interfaces';
import { randomIntFromInterval } from '../../test-utils';

export interface SearchContactsJSONAdapterDataSource {
  directory: IWebexIntContact[];
  contacts: IWebexIntContact[];
}

/**
 * `SearchContactsJSONAdapter` is an implementation of the `ISearchContactsAdapter` interface.
 * This implementation utilizes a JSON object as its source of contact data.
 *
 */
export class SearchContactsJSONAdapter implements ISearchContactsAdapter {
  private datasource: SearchContactsJSONAdapterDataSource;

  constructor(ds: SearchContactsJSONAdapterDataSource) {
    this.datasource = ds;
  }

  search(
    opts: ISearchContactsAdapterSearchInput
  ): Promise<ISearchContactsAdapterSearchResponse> {
    const lowerSearchText = opts.searchText.toLowerCase();
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredContacts = this.datasource.contacts.filter(
          (contact) => contact.name.toLowerCase().indexOf(lowerSearchText) > -1
        );
        const filteredDirectory = this.datasource.directory.filter(
          (contact) => contact.name.toLowerCase().indexOf(lowerSearchText) > -1
        );
        resolve({
          count: filteredContacts.length + filteredDirectory.length,
          items: {
            directory: filteredDirectory,
            outlook: filteredContacts,
          },
        });
      }, randomIntFromInterval(50, 300));
    });
  }

  getSources() {
    return ['directory', 'outlook'];
  }
}
