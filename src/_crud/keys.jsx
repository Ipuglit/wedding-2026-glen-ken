import { generate_jwt_decrypt } from '@/_hooks/encryptic';
import * as Fnc from '@hooks/functions';

export const TimeZoned = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const Key_Alpha = (obj = {}, caps = true ) => {

  const result = {};

  Object.keys(obj).forEach((key) => {

    const finalKey    = caps ? key.toUpperCase() : key.toLowerCase();

    result[finalKey]  = obj[key];

  });

  return result;
};

export const Key_Setting = (i = {}, rev = false) => {

  const defaults = {

                        PAGE:           1,
                        LIMIT:          10,
                        ORDER:          'DESC',
                        SORT:           'stated',

                        STATUS:         'ACTIVE',
                        SEARCH:         '',

                    };

  const transform = rev ? (k) => k.toLowerCase() : (k) => k.toUpperCase();

  const merged = { ...defaults, ...i };

  return Object.fromEntries(
    Object.entries(merged).map(([k, v]) => [transform(k), v ?? defaults[k]])
  );

};


export function Auth_Fetch(i) {

    generate_jwt_decrypt()

    const Token = generate_jwt_decrypt()?.userProfile

    const Auth =    {
                        A:      Token?.id       || 0,
                        B:      Token?.role_id   || 0,
                        C:      Token?.token    || '',
                        ...Key_Setting(i),
                    }; 

                                            
    return  Auth || { }

}

export function Auth_Post(i) {

    generate_jwt_decrypt()

    const Token = generate_jwt_decrypt()?.userProfile

    const Post = {
                        A:      Token?.id       || 0,
                        B:      Token?.role_id   || 0,
                        C:      Token?.token    || '',
                        ...i,
                    }; 
                                            
    return Post || { }

}

