import { useCallback, useContext, useState } from 'react';
import { ISearchContactsAdapterSearchResponse } from '@webex/component-adapter-interfaces/dist/cjs/src';
import { AdapterContext } from '../contexts/AdapterContext';
import { useDebouncedEffect } from './useDebouncedEffect';
// import { Logger } from '@webex-int/logger';

export enum StatusCode{
  SUCCESS = 200
 }
/**
 * Handles the searching of contacts, relaying the react state
 *
 * @param {string} searchText text to search for in contacts
 * @returns {[ISearchContactsAdapterSearchResponse, boolean]} array containing search response and loading boolean respectively
 */
export const useContactSearch: (
  _: string
) => [string[], ISearchContactsAdapterSearchResponse, boolean] = (
  searchText: string
) => {
    const [items, setItems] = useState<ISearchContactsAdapterSearchResponse>({
      items: {},
      count: 0,
    });
    const [searching, setSearching] = useState<boolean>(false);
    const ctx = useContext(AdapterContext);

    const sources = ctx?.searchContactsAdapter?.getSources() || [];

    const searchContacts = useCallback(
      async (searchTextValue: string) => {
        if (!ctx?.searchContactsAdapter) {
          console.error('context does not contain field searchContactsAdapter');
          return;
        }
        setSearching(true);
        try {
          // Added condition to stop searching the empty field
          if (searchTextValue) {
            const data = await ctx.searchContactsAdapter.search({
              searchText: searchTextValue,
            });
            setItems(data);
          }
        } catch (e) {
          // Logger.error(
          //   `Contatc search error case: '${e}'.`
          // );
        } finally {
          setSearching(false);
        }
      },
      [ctx?.searchContactsAdapter]
    );

    useDebouncedEffect(
      () => searchContacts(searchText),
      [searchText, searchContacts],
      StatusCode.SUCCESS,
      () => setSearching(true)
    );

    return [sources, items, searching];
  };
