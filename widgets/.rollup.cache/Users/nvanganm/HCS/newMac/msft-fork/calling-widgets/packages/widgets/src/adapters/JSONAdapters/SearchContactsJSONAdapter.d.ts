import { ISearchContactsAdapter, ISearchContactsAdapterSearchInput, ISearchContactsAdapterSearchResponse, IWebexIntContact } from '@webex-int/adapter-interfaces';
export interface SearchContactsJSONAdapterDataSource {
    directory: IWebexIntContact[];
    contacts: IWebexIntContact[];
}
/**
 * `SearchContactsJSONAdapter` is an implementation of the `ISearchContactsAdapter` interface.
 * This implementation utilizes a JSON object as its source of contact data.
 *
 */
export declare class SearchContactsJSONAdapter implements ISearchContactsAdapter {
    private datasource;
    constructor(ds: SearchContactsJSONAdapterDataSource);
    search(opts: ISearchContactsAdapterSearchInput): Promise<ISearchContactsAdapterSearchResponse>;
    getSources(): string[];
}
//# sourceMappingURL=SearchContactsJSONAdapter.d.ts.map