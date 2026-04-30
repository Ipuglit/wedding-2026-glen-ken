import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Box, 
    Typography, 
    CircularProgress,
    IconButton,
    Grid
} from '@mui/material';
import { useProTheme } from '@theme/store-theme-pro';
import { Iconic } from '@/_components/icons';

export const Dialog_DrivePreview = ({ open, onClose }) => {
    const { colors } = useProTheme();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const pinkAccent = "#F48FB1";
    const deepPink = "#C2185B";

    const getDriveImageUrl = (url) => {
        if (!url) return "";
        const match = url.match(/\/d\/(.*?)\//);
        if (!match) return url;
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    };

    const fetchDriveImages = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                "https://script.google.com/macros/s/AKfycbzPdHkC6tvA5xj_RrV5vmcUsRvTbaZUjM2ZILPAI7PtBuz5b2oMZdbTvqtHWw6dfReL/exec?action=getImages"
            );

            const data = await response.json();

            if (data.status === 'success') {
                setImages(data.files);
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) fetchDriveImages();
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
            PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: deepPink, fontWeight: 800 }}>
                    Captured Moments
                </Typography>

                <IconButton onClick={onClose}>
                    <Iconic icon="close" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ minHeight: 300, bgcolor: '#FFF5F7' }}>

                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                        <CircularProgress sx={{ color: pinkAccent }} />
                        <Typography sx={{ mt: 2, color: '#A07883' }}>
                            Loading memories...
                        </Typography>
                    </Box>
                ) : images.length > 0 ? (
                    <Grid container spacing={2}>
                        {images.map((img, index) => (
                            <Grid item xs={6} sm={4} md={3} key={index}>
                                <Box
                                    sx={{
                                        width: '100%',
                                        aspectRatio: '1/1',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        border: '3px solid white',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <img
                                        src={getDriveImageUrl(img.url)}
                                        alt={img.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/300?text=Image";
                                        }}
                                    />
                                </Box>

                                <Typography
                                    noWrap
                                    sx={{
                                        fontSize: 11,
                                        mt: 0.5,
                                        textAlign: 'center',
                                        color: '#A07883'
                                    }}
                                >
                                    {img.name}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                        <Typography sx={{ color: '#A07883' }}>
                            No images found
                        </Typography>
                    </Box>
                )}

            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} sx={{ color: deepPink }}>
                    Close
                </Button>

                <Button
                    onClick={fetchDriveImages}
                    variant="contained"
                    sx={{ bgcolor: deepPink }}
                >
                    Refresh
                </Button>
            </DialogActions>
        </Dialog>
    );
};