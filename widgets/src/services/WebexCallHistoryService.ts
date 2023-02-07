import { Logger, formatError, LOGGER } from '@webex-int/logger';
import {
  createCallHistoryClient,
  EVENT_KEYS,
} from '@webex/web-calling-sdk';
import {
  SORT,
  SORT_BY,
  DATE,
  LIMIT,
  IWebexCallHistoryResponse,
} from '@webex-int/adapter-interfaces';
import { TriggerWebexInstanceFromPromise } from './WebexInstanceService';
import { eventEmitter, EventType } from '.';
/**
 *
 */
let makeRegister = true;
export async function listRecentCallEvents(): Promise<IWebexCallHistoryResponse> {
  try {
    return TriggerWebexInstanceFromPromise().then(async (res) => {
      let response;
      if (res === 200) {
        const callHistoryClient:any = createCallHistoryClient(window.webex, {
          level: LOGGER.INFO,
        });
        if (makeRegister) {
          callHistoryClient.on(
            EVENT_KEYS.CALL_HISTORY_USER_SESSION_INFO,
            (sessionData: any) => {
              Logger.info(
                `Users recent session data from service: '${
                sessionData.data.userSessions.userSessions[0]}'`
              );
              eventEmitter.dispatch(EventType.AUTO_REFRESH, 'autorefresh');
            }
          );
          makeRegister = false;
        }
        response = await callHistoryClient.getCallHistoryData(
          DATE.DEFAULT,
          LIMIT.DEFAULT,
          SORT.DEFAULT,
          SORT_BY.DEFAULT
        );
        return response as unknown as IWebexCallHistoryResponse;
      } else {
        return [] as unknown as IWebexCallHistoryResponse;
      }
    });
  } catch (error) {
    Logger.error(
      `WebexClient.recentCallEvents(): got error: '${formatError(error)}'.`
    );
    throw error;
  }
}
