
export const api_provider                                               = import.meta.env.VITE_PROVIDER;

export const api_path                                                   = import.meta.env.VITE_PATH_API

export const api_get                                                    = api_provider + api_path + import.meta.env.VITE_PATH_GET || '';
export const api_post                                                   = api_provider + api_path + import.meta.env.VITE_PATH_POST || '';

export const api_keys    =  {
                                sys_welcome:                              import.meta.env.VITE_API_SYS_WELCOME,
                                sys_contacts:                             import.meta.env.VITE_API_SYS_CONTACTS,
                                sys_videos:                               import.meta.env.VITE_API_SYS_VIDEOS,
                            }


