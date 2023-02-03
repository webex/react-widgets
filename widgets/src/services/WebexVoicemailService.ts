import { createVoicemailClient } from '@webex/web-calling-sdk';
import { Logger, formatError, LOGGER } from '@webex-int/logger';
import {
  IVoiceMailResponse,
  SORT,
  VOICEMAIL_LIMIT,
  IVoiceMailDeleteResponse,
} from '@webex-int/adapter-interfaces';
import { TriggerWebexInstance } from './WebexInstanceService';

export async function getVoiceMailList(): Promise<IVoiceMailResponse> {
  try {
    TriggerWebexInstance();
    const callvoicemailClient = createVoicemailClient((window as any).webex, {
      level: LOGGER.INFO,
    });
    await callvoicemailClient?.init();
    const response = await callvoicemailClient.getVoicemailList(
      0,
      VOICEMAIL_LIMIT.OFFSET_LIMIT,
      SORT.DESC
    );
    Logger.info(`WebexVoicemailService:getVoiceMailList(): done.`);
    return response as unknown as IVoiceMailResponse;
  } catch (error) {
    Logger.error(
      `WebexVoicemailService.getVoiceMailList(): got error: '${formatError(
        error
      )}'.`
    );
    throw error;
  }
}

export async function deleteVoiceMail(
  voicemailId: string
): Promise<IVoiceMailDeleteResponse> {
  try {
    const callvoicemailClient = createVoicemailClient((window as any).webex, {
      level: LOGGER.INFO,
    });
    await callvoicemailClient.init();
    const response = await callvoicemailClient.deleteVoicemail(voicemailId);
    Logger.info(`WebexVoicemailService:deleteVoiceMail(): done.`);
    return response as IVoiceMailDeleteResponse;
  } catch (error) {
    Logger.error(
      `WebexVoicemailService.deleteVoiceMail(): got error: '${formatError(
        error
      )}'.`
    );
    throw error;
  }
}
