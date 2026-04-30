import { fetch_Data } from './fetchData';

let controller;
let lastCallTime = 0;

export const fetch_Contacts = async (setting = {}, tryLimit = 3) => {

  const now = Date.now();

  if (now - lastCallTime < 500) {
    return {
                duration:   0,
                tries:      0,
                pages:      { },
                setting:    setting,
                status:     'THROTTLED',
                message:    'Too many requests. Please wait',
            };
  }

  lastCallTime = now;

  if (controller) {
    controller.abort();
  }

  controller = new AbortController();

  return fetch_Data(
                      'contacts',
                      { ...setting, signal: controller.signal },
                      tryLimit
                    );
};