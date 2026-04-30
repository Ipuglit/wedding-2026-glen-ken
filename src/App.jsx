import React, { useEffect, useRef, useState } from 'react';
import { Box, Fade, Button } from '@mui/material';

import { upLoader } from '@/_components/loader/store-loader';
import { useProTheme } from '@theme/store-theme-pro';
import * as Fnc from '@hooks/functions'
import { Page_ImageUploading } from './sections/upload-image/up-images';
import { Page_ImageHeader } from './sections/upload-image/up-header';
import { Page_ImageGcash } from './sections/upload-image/up-gcash';
import { useWedding } from '@hooks/supa-fetch-wedding';
import { Dialog_DrivePreview } from './sections/_dialogs/dia_preview_drive';

export default function App() {

  const { setThemeMode, is_mobile } = useProTheme();
  const { dataWed, loadWed, fetchWed } = useWedding();
  const [openPreview, setOpenPreview] = useState(false);

  const startTimeRef = useRef(null);
  const images = import.meta.glob(
    './_assets/images_slide/*.{jpg,jpeg,png,webp}',
    { eager: true }
  );

  const imageList = Object.values(images).map((img) => img.default);

  useEffect(() => {
    let timer;

    if (loadWed) {
      startTimeRef.current = Date.now();
      upLoader(true);
    } else {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(2000 - elapsed, 0);

      timer = setTimeout(() => {
        upLoader(false);
      }, remaining);
    }

    return () => clearTimeout(timer);
  }, [loadWed]);

  useEffect(() => {
    setThemeMode('light');
    fetchWed("kent_glenda");
  }, []);

  return (
    <Fade in={true} timeout={1000}>
      <Box sx={{ pt: 2, px: is_mobile ? 1 : 20, pb: 10 }}>

        <Page_ImageHeader
          title={dataWed?.title || 'Loading'}
          date={dataWed?.datetime || 'Loading'}
          address={dataWed?.address || 'Loading'}
          images={imageList}
        />

        <Page_ImageUploading onUploadComplete={() => setOpenPreview(true)} />

      </Box>
    </Fade>
  );
}