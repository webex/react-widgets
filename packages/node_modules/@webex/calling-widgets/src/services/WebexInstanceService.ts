import { Logger, formatError } from '@webex-int/logger';
const webex = require('@webex-int/widgets/src/webex-js-sdk/webex');
declare global {
  interface Window {
    webex: any;
  }
}

const webexConfig = {
  config: {
    services: {
      discovery: {
        u2c: 'https://u2c-intb.ciscospark.com/u2c/api/v1',
        hydra: 'https://apialpha.ciscospark.com/v1/',
      },
    },
    // Any other sdk config we need
  },
  credentials: {
    access_token: localStorage.getItem("webex_auth_token"),
  },
};

const register = async () => {
  try {
    await window?.webex?.internal?.device?.register();
    await window?.webex?.internal?.mercury?.connect();
  } catch (e) {
    throw e;
  }
};

export async function TriggerWebexInstance() {
  window.webex = await webex?.init(webexConfig)?.once(
    'ready',
    () => {
      Logger.info(
        'Authentication#initWebex() :: Webex Ready From Widget level'
      );
      register();
    },
    (error: any) => {
      Logger.error(`Authentication#initWebex(): '${formatError(error)}'.`);
    }
  );
}

let callWebexIfNotExist = true;
export async function TriggerWebexInstanceFromPromise(){
  return new Promise((resolve, reject) => {
    if(callWebexIfNotExist){
      window.webex =  webex?.init(webexConfig)?.once(
        'ready',
        async () => {
          Logger.info(
            'Authentication#initWebex() :: Webex Ready From Widget level'
          );
          await window?.webex?.internal?.device?.register();
          await window?.webex?.internal?.mercury?.connect();
          resolve(200);
          callWebexIfNotExist = false;
        },
        (error: any) => {
          Logger.error(`Authentication#initWebex(): '${formatError(error)}'.`);
          reject(400)
          
        }
      );
    }  else{
      resolve(200);
    }
    
    });
} 

