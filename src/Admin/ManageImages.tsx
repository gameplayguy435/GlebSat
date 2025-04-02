import { useState, useEffect, ChangeEvent } from 'react';
import { 
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid2 as Grid,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { 
    AddPhotoAlternate,
    Edit,
    ToggleOn,
    ToggleOff,
    CloudUpload,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AntSwitch from './components/AntSwitch';
import { styled } from '@mui/material/styles';
import eventHandler from './services/EventHandler';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

interface GalleryImage {
    id: number;
    name: string;
    image: string;
    category: number | null;
    news_article: number | null;
    active: boolean;
}

interface Category {
    id: number;
    name: string;
}

interface NewsArticle {
    id: number;
    title: string;
}

const FileInput = styled('input')({
    height: 0,
    position: 'absolute',
});

const ImagesContent = () => {
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const [currentImage, setCurrentImage] = useState<GalleryImage | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(API_URL + '/category');
                const data = await response.json();
                
                if (data.success) {
                    setCategories(data.categories);
                    console.log('Categories loaded:', data.categories);
                } else {
                    console.error('Erro ao carregar as categorias: ', data.message);
                    enqueueSnackbar('Erro: ao carregar as categorias', { variant: 'error' });
                }
            } catch (err) {
                console.error('Erro ao carregar as categorias:', err);
                enqueueSnackbar('Erro: ' + err, { variant: 'error' });
            }
        }

        const fetchNewsArticles = async () => {
            try {
                const response = await fetch(API_URL + '/newsarticle');
                const data = await response.json();
                
                if (data.success) {
                    setNewsArticles(data.news_articles);
                    console.log('News Articles loaded:', data.news_articles);
                } else {
                    console.error('Erro ao carregar as notícias:', data.message);
                    enqueueSnackbar('Erro ao carregar as notícias', { variant: 'error' });
                }
            } catch (err) {
                console.error('Erro ao carregar as notícias:', err);
                enqueueSnackbar('Erro: ' + err, { variant: 'error' });
            }
        }

        const fetchImages = async () => {
            try {
                const response = await fetch(API_URL + '/image');
                const data = await response.json();
                
                if (data.success) {
                    const updatedUrlImages = data.images.map(img => ({
                        ...img,
                        image: img.image.startsWith('../backend') ? img.image : '../backend' + img.image,
                    }));
                    setImages(updatedUrlImages);
                    console.log('Images loaded:', updatedUrlImages);
                } else {
                    console.error('Erro ao carregar as imagens:', data.message);
                    enqueueSnackbar('Erro ao carregar as imagens', { variant: 'error' });
                }
            } catch (err) {
                console.error('Erro ao carregar as imagens:', err);
                enqueueSnackbar('Erro: ' + err, { variant: 'error' });
            }
        }

        fetchCategories();
        fetchNewsArticles();
        fetchImages();
        setLoading(false);

        const handleNewsArticleUpdate = () => {
            fetchNewsArticles();
        }

        eventHandler.on('news-articles-updated', handleNewsArticleUpdate);

        return () => {
            eventHandler.remove('news-articles-updated', handleNewsArticleUpdate);
        }
    }, []);

    const saveImages = async (path: string, image: GalleryImage, file?: File): Promise<boolean> => {
        try {
            const formData = new FormData();
            formData.append('name', image.name);
            if (image.category !== null) formData.append('category', image.category.toString());
            if (image.news_article !== null) formData.append('news_article', image.news_article.toString());
            formData.append('active', image.active.toString());
            
            if (file) {
                formData.append('image', file);
            }

            const response = await fetch(API_URL + path, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            
            if (data.success) {
                const updatedUrlImages = data.images.map(img => ({
                    ...img,
                    image: img.image.startsWith('../backend') ? img.image : '../backend' + img.image,
                }));
                setImages(updatedUrlImages);

                eventHandler.dispatch('images-updated');

                return true;
            } else {
                console.error('Ocorreu um erro ao guardar a imagem:', data.message);
                enqueueSnackbar('Erro: ' + data.message, { variant: 'error' });
                return false;
            }
        } catch (err) {
            console.error('Erro ao guardar a imagem:', err);
            enqueueSnackbar('Erro de conexão ao guardar a imagem', { variant: 'error' });
            return false;
        }
    }
    
    const handleToggleActive = (image: GalleryImage) => {
        const imageToUpdate = images.find(img => img.id === image.id);
        if (imageToUpdate) {
            imageToUpdate.active = !imageToUpdate.active;
            saveImages('/image/update/' + imageToUpdate.id, imageToUpdate, undefined);
        }
        
        enqueueSnackbar(
            `Imagem ${image.active ? 'ativada' : 'desativada'} com sucesso!`, 
            { variant: 'success', autoHideDuration: 3000 }
        );
    };
    
    const handleSave = async () => {
        if (!currentImage) {
            return;
        }

        if (!currentImage.name.trim()) {
            enqueueSnackbar(
                "Por favor, escolha um nome", 
                { variant: 'error', autoHideDuration: 3000 }
            );
            return;
        }
        if (!currentImage.category) {
            enqueueSnackbar(
                "Por favor, selecione uma categoria", 
                { variant: 'error', autoHideDuration: 3000 }
            );
            return;
        }
        if (currentImage.id === 0) {
            if (!imageFile) {
                enqueueSnackbar(
                    "Por favor, escolha uma imagem para adicionar!",
                    { variant: 'error', autoHideDuration: 3000 }
                );
                return;
            }

            var inserted = await saveImages('/image/create', currentImage, imageFile);
            if (inserted) {
                enqueueSnackbar(
                    "Imagem adicionada com sucesso!", 
                    { variant: 'success', autoHideDuration: 3000 }
                );
            }
        } else {
            var inserted = await saveImages('/image/update/' + currentImage.id, currentImage, imageFile ? imageFile : undefined);
            if (inserted) {
                enqueueSnackbar(
                    "Imagem atualizada com sucesso!", 
                    { variant: 'success', autoHideDuration: 3000 }
                );
            }
        }
        
        handleDialogClose();
    };

    const handleDialogOpen = (image: GalleryImage | null = null) => {
        if (image) {
            setCurrentImage(image);
            setImagePreview(image.image);
        } else {
            setCurrentImage({ 
                id: 0, 
                name: "", 
                image: "", 
                category: null, 
                news_article: null, 
                active: true 
            });
            setImagePreview(null);
        }
        setImageFile(null);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setCurrentImage(null);
        setImagePreview(null);
        setImageFile(null);
    };
    
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    setImagePreview(e.target.result as string);
                    if (currentImage) {
                        setCurrentImage({
                            ...currentImage,
                        });
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (currentImage) {
            setCurrentImage({
                ...currentImage,
                [name]: value
            });
        }
    };
    
    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        if (currentImage) {
            setCurrentImage({
                ...currentImage,
                [name]: value
            });
        }
    };
    
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Gestão de Imagens
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleDialogOpen()}
                    startIcon={<AddPhotoAlternate />}
                    sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 'normal'
                    }}
                >
                    Adicionar Imagem
                </Button>
            </Box>
            
            {/* Group images by category */}
            {images.length === 0 ? (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ 
                            textAlign: 'center', 
                            py: 8, 
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            border: '1px dashed',
                            borderColor: 'divider'
                        }}>
                            <AddPhotoAlternate sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3 }} />
                            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                                Nenhuma imagem disponível
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            ) : (
                // Map through categories and display images for each
                categories.map(category => {
                    const categoryImages = images.filter(image => image.category === category.id);
                    if (categoryImages.length === 0) return null;
                    
                    return (
                        <Box 
                            key={category.id}
                            component={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            sx={{ mb: 5 }}
                        >
                            <Typography 
                                variant="h5" 
                                component="h2" 
                                sx={{ 
                                    mb: 3, 
                                    fontWeight: 500,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    pb: 1
                                }}
                            >
                                {category.name}
                            </Typography>
                            
                            <Grid container spacing={3}>
                                {categoryImages.map((image) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={image.id}>
                                        <Box
                                            component={motion.div}
                                            whileHover={{ 
                                                y: -5, 
                                                boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
                                            }}
                                            sx={{ 
                                                borderRadius: 4,
                                                overflow: 'hidden',
                                                height: '230px',
                                                position: 'relative',
                                                opacity: image.active ? 1 : 0.6,
                                                boxShadow: 3
                                            }}
                                        >
                                            <Box 
                                                sx={{ 
                                                    position: 'relative',
                                                    height: '100%',
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={image.image}
                                                    alt={image.name}
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                
                                                {/* Overlay with actions */}
                                                <Box 
                                                    component={motion.div}
                                                    initial={{ opacity: 0 }}
                                                    whileHover={{ opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'space-between',
                                                        p: 2
                                                    }}
                                                >
                                                    <Box>
                                                        <Typography 
                                                            variant="subtitle1" 
                                                            sx={{ 
                                                                color: 'white',
                                                                fontWeight: 'bold',
                                                                textShadow: '0px 2px 4px rgba(0,0,0,0.5)'
                                                            }}
                                                        >
                                                            {image.name}
                                                        </Typography>
                                                    </Box>
                                                    
                                                    {/* Fixed action buttons */}
                                                    <Box 
                                                        sx={{ 
                                                            display: 'flex', 
                                                            justifyContent: 'center', 
                                                            gap: 2
                                                        }}
                                                    >
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleToggleActive(image)}
                                                            sx={{ 
                                                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                                                color: 'white',
                                                                textTransform: 'none',
                                                                minWidth: '36px',
                                                                width: '36px',
                                                                height: '36px',
                                                                padding: 0,
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                                                                }
                                                            }}
                                                        >
                                                            {image.active ? <ToggleOn /> : <ToggleOff />}
                                                        </Button>
                                                        
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleDialogOpen(image)}
                                                            sx={{ 
                                                                bgcolor: 'rgba(255, 255, 255, 0.15)',
                                                                color: 'white',
                                                                textTransform: 'none',
                                                                minWidth: '36px',
                                                                width: '36px',
                                                                height: '36px',
                                                                padding: 0,
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                '&:hover': {
                                                                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                                                                }
                                                            }}
                                                        >
                                                            <Edit />
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    );
                })
            )}
            
            {/* Edit/Create Dialog */}
            <Dialog 
                open={dialogOpen} 
                onClose={handleDialogClose} 
                maxWidth="md" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        backgroundImage: 'none',
                        overflow: 'hidden',
                        boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
                    }
                }}
            >
                <DialogTitle sx={{ 
                    px: 4, 
                    py: 3,
                    fontSize: '1.5rem', 
                    fontWeight: 600,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}>
                    {currentImage && currentImage.id ? 'Editar Imagem' : 'Nova Imagem'}
                </DialogTitle>
                <DialogContent sx={{ px: 4, py: 3 }}>                
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            <FormControl>
                                <FormLabel 
                                    htmlFor="name"
                                    sx={{ 
                                        mb: 1, 
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Nome
                                </FormLabel>
                                <TextField
                                    id="name"
                                    name="name"
                                    required
                                    fullWidth
                                    placeholder="Nome ou descrição da imagem"
                                    variant="outlined"
                                    value={currentImage?.name || ''}
                                    onChange={handleInputChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                        }
                                    }}
                                />
                            </FormControl>
                            
                            <FormControl>
                                <FormLabel 
                                    htmlFor="category"
                                    sx={{ 
                                        mb: 1, 
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Categoria
                                </FormLabel>
                                <Select
                                    id="category"
                                    name="category"
                                    value={currentImage?.category || ''}
                                    onChange={handleSelectChange}
                                    displayEmpty
                                    sx={{
                                        borderRadius: 1,
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Selecione uma categoria</em>
                                    </MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Determine onde a imagem aparecerá na galeria</FormHelperText>
                            </FormControl>
                            
                            <FormControl>
                                <FormLabel 
                                    htmlFor="news_article"
                                    sx={{ 
                                        mb: 1, 
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Notícia Associada (opcional)
                                </FormLabel>
                                <Select
                                    id="news_article"
                                    name="news_article"
                                    value={currentImage?.news_article || ''}
                                    onChange={handleSelectChange}
                                    displayEmpty
                                    sx={{
                                        borderRadius: 1,
                                    }}
                                >
                                    <MenuItem value="">
                                        <em>Nenhuma notícia associada</em>
                                    </MenuItem>
                                    {newsArticles.map((article) => (
                                        <MenuItem key={article.id} value={article.id}>
                                            {article.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Associar esta imagem a uma notícia específica</FormHelperText>
                            </FormControl>
                            
                            <FormControl>
                                <FormLabel 
                                    htmlFor="image"
                                    sx={{ 
                                        mb: 1, 
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Ficheiro de Imagem
                                </FormLabel>
                                <Box sx={{ mb: 2 }}>
                                    <Button
                                        component="label"
                                        variant="outlined"
                                        startIcon={<CloudUpload />}
                                        fullWidth
                                        sx={{ 
                                            borderRadius: 1,
                                            textTransform: 'none'
                                        }}
                                    >
                                        Carregar imagem
                                        <FileInput 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </Button>
                                </Box>
                                
                                {/* Image preview */}
                                {imagePreview && (
                                    <Box 
                                        sx={{ 
                                            mt: 2, 
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                            p: 1,
                                            width: '100%',
                                            maxHeight: '200px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={imagePreview}
                                            alt="Preview"
                                            sx={{
                                                maxWidth: '100%',
                                                maxHeight: '180px',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </Box>
                                )}
                            </FormControl>
                            
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    gap: 4,
                                    mt: 2,
                                    pt: 2,
                                    borderTop: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <FormControlLabel
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '0.875rem'
                                        }
                                    }}
                                    control={
                                        <AntSwitch 
                                            checked={currentImage?.active ?? true} 
                                            onChange={(e) => {
                                                if (currentImage) {
                                                    setCurrentImage({
                                                        ...currentImage,
                                                        active: e.target.checked
                                                    });
                                                }
                                            }}
                                            sx={{ mr: 3.5, left: 15 }}
                                        />
                                    }
                                    label="Ativa na galeria"
                                />
                            </Box>
                        </Stack>
                    </LocalizationProvider>
                </DialogContent>
                
                <DialogActions 
                    sx={{ 
                        px: 4, 
                        py: 3,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        gap: 1
                    }}
                >
                    <Button 
                        onClick={handleDialogClose}
                        variant="outlined"
                        sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 1,
                            textTransform: 'none',
                            fontWeight: 'normal'
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        variant="contained" 
                        color="primary"
                        sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 1,
                            textTransform: 'none',
                            fontWeight: 'normal'
                        }}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

const ManageImages = () => {
    return (
        <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            preventDuplicate
        >
            <ImagesContent />
        </SnackbarProvider>
    );
};

export default ManageImages;