import { fetch_Data } from "./api-fetch";

let controller;
let lastCallTime = 0;

export const fetch_Users = async (setting = {}, tryLimit = 3) => {

  const now = Date.now();

  if (now - lastCallTime < 500) {
    return {
                duration:   0,
                tries:      0,
                pages:      { },
                setting:    setting,
                status:     'THROTTLED',
                message:    'Too many requests. Please wait',
                loading:    false
            };
  }

  lastCallTime = now;

  if (controller) {
    controller.abort();
  }

  controller = new AbortController();

  const res = await fetch_Data(
                                'users',
                                { ...setting, signal: controller.signal },
                                tryLimit
                              );

  return {
            ...res,
            loading: false
         };
};