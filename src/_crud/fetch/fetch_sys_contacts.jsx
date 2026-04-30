import { useState } from 'react';
import { fetch_Data } from './api-fetch';

export const useFetch_SysContacts =()=>{

    const [gotSysContacts, setgotSysContacts] = useState({
                                                                data: [],
                                                                setting: {},
                                                                load: true,
                                                                duration: 0,
                                                                tries: 0,
                                                                status: ''
                                                            });


    const getSysContacts = async (setting) => {

        setgotSysContacts(prev => ({ ...prev, load: true, status: 'LOADING' }));

        const newSetting = {
                                  ...setting,
                                  coding_a:     'TATANG',
                                  coding_z:     'NANANG',
                                  public:       true
                              };

        const results = await fetch_Data('sys_welcome', newSetting);

        setgotSysContacts(prev => ({
                                ...prev,
                                ...(results || {}),
                                load: false,
                            }));
    };

    return { gotSysContacts, getSysContacts };
};