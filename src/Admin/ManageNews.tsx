import { useState, useEffect, MouseEvent, ChangeEvent } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    CircularProgress,
    Dialog, 
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid2 as Grid,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { 
    AddCircleOutlineRounded,
    CalendarMonthRounded,
    Edit,
    MoreVert,
    PostAdd,
    PushPin,
    NotInterested,
    ToggleOff,
    ToggleOn,
} from '@mui/icons-material';
import CustomDatePicker from './components/CustomDatePicker';
import AntSwitch from './components/AntSwitch';
import { SnackbarProvider, useSnackbar } from 'notistack';
import dayjs, { Dayjs } from 'dayjs';
import eventHandler from './services/EventHandler';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

interface NewsArticle {
    id?: number;
    title: string;
    summary: string;
    content: string;
    published_date?: string | null;
    author: number;
    active: boolean;
    pinned: boolean;
    main_image?: string | null;
}

const NewsContent = () => {
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentMenuIndex, setCurrentMenuIndex] = useState<number | null>(null);
    
    const [currentNewsArticle, setCurrentNewsArticle] = useState<NewsArticle | null>(null);
    const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

    useEffect(() => {
        const fetchNewsArticles = async () => {
            try {
                const response = await fetch(API_URL + '/newsarticle');
                const data = await response.json();
                
                if (data.success) {
                    const articlesWithFreshImages = data.news_articles.map(article => ({
                        ...article,
                        main_image: article.main_image ? article.main_image : null
                    }));
                    setNewsArticles(articlesWithFreshImages);
                    console.log('News Articles loaded:', articlesWithFreshImages);
                } else {
                    console.error('Erro ao carregar as notícias:', data.message);
                    enqueueSnackbar('Erro ao carregar as notícias.', { variant: 'error' });
                }
            } catch (err) {
                console.error('Erro ao carregar as notícias:', err);
                enqueueSnackbar('Erro ao carregar as notícias.', { variant: 'error' });
            }
        };
        
        fetchNewsArticles();
        setLoading(false);

        const handleImageUpdate = () => {
            fetchNewsArticles();
        }

        eventHandler.on('images-updated', handleImageUpdate);

        return () => {
            eventHandler.remove('images-updated', handleImageUpdate);
        }
    }, []);
    
    const saveNewsArticles = async (path: string, newsArticle: NewsArticle): Promise<boolean> => {
        try {
            const defaultSummary = newsArticle.content.length > 100 ? newsArticle.content.substring(0, 100) + '...' : newsArticle.content;
            const formData = new FormData();

            formData.append('title', newsArticle.title);
            newsArticle.summary ? formData.append('summary', newsArticle.summary) : formData.append('summary', defaultSummary);
            formData.append('content', newsArticle.content);
            newsArticle.published_date ? formData.append('published_date', newsArticle.published_date) : formData.append('published_date', new Date().toISOString().split('T')[0]);

            const userId = localStorage.getItem('userId');
            formData.append('author', userId && userId !== '' ? userId : '1');

            formData.append('active', newsArticle.active.toString());
            formData.append('pinned', newsArticle.pinned.toString());

            const response = await fetch(API_URL + path, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            
            if (data.success) {
                setNewsArticles(data.news_articles);
                
                eventHandler.dispatch('news-articles-updated');

                return true;
            } else {
                console.error('Erro ao guardar a notícia:', data.message);
                enqueueSnackbar('Erro ao guardar a notícia.', { variant: 'error' });
                return false;
            }
        } catch (err) {
            console.error('Erro ao guardar a notícia:', err);
            enqueueSnackbar('Erro de conexão ao guardar a notícia.', { variant: 'error' });
            return false;
        }
    }
    
    const handleSave = async () => {
        if (currentNewsArticle) {
            if (!currentNewsArticle.title.trim()) {
                enqueueSnackbar('O título é obrigatório!', { variant: 'error' });
                return;
            }
            
            if (!currentNewsArticle.content.trim()) {
                enqueueSnackbar('O conteúdo da notícia é obrigatório!', { variant: 'error' });
                return;
            }
            if (currentNewsArticle.id === 0) {
                var inserted = await saveNewsArticles('/newsarticle/create', currentNewsArticle);
                if (inserted) {
                    enqueueSnackbar(
                        "Notícia criada com sucesso!", 
                        { variant: 'success', autoHideDuration: 3000 }
                    );
                }
            } else {
                var inserted = await saveNewsArticles('/newsarticle/update/' + currentNewsArticle.id, currentNewsArticle);
                if (inserted) {
                    enqueueSnackbar(
                        "Notícia atualizada com sucesso!", 
                        { variant: 'success', autoHideDuration: 3000 }
                    );
                }
            }
        }
        
        handleDialogClose();
    };

    const handleToggleActive = async () => {
        if (currentMenuIndex === null) return;
        
        const newsArticle = newsArticles[currentMenuIndex];
        const pinned = !newsArticle.active ? newsArticle.pinned : false;
        const updatedArticle = {
            ...newsArticle,
            active: !newsArticle.active,
            pinned: pinned
        };
        
        const success = await saveNewsArticles('/newsarticle/update/' + newsArticle.id, updatedArticle);
        if (success) {
            enqueueSnackbar(
                `Notícia ${newsArticle.active ? 'desativada' : 'ativada'} com sucesso!`, 
                { variant: 'success', autoHideDuration: 3000 }
            );
        }
        
        handleMenuClose();
    };

    const handleTogglePinned = async () => {
        if (currentMenuIndex === null) return;
        
        const newsArticle = newsArticles[currentMenuIndex];
        const updatedArticle = {...newsArticle, pinned: !newsArticle.pinned};
        
        const success = await saveNewsArticles('/newsarticle/update/' + newsArticle.id, updatedArticle);
        if (success) {
            enqueueSnackbar(
                `Notícia ${newsArticle.pinned ? 'desafixada' : 'afixada'} com sucesso!`, 
                { variant: 'success', autoHideDuration: 3000 }
            );
        }
        
        handleMenuClose();
    };

    const handleDialogOpen = (newsArticle: NewsArticle | null = null) => {
        const userId = localStorage.getItem('userId');
        const authorId = userId && userId !== '' ? parseInt(userId) : 1;
        
        if (newsArticle) {
            const dateString = newsArticle.published_date || new Date().toISOString().split('T')[0];
            setCurrentNewsArticle({
                ...newsArticle,
                published_date: dateString
            });
        } else {
            setCurrentNewsArticle({ 
                id: 0, 
                title: "", 
                summary: "", 
                content: "",
                published_date: new Date().toISOString().split('T')[0],
                author: authorId,
                active: true,
                pinned: false,
            });
        }
        setDialogOpen(true);
        handleMenuClose();
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
        setCurrentNewsArticle(null);
    };

    const handleMenuOpen = (e: MouseEvent<HTMLElement>, index: number) => {
        setAnchorEl(e.currentTarget);
        setCurrentMenuIndex(index);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setCurrentMenuIndex(null);
    };
    
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (currentNewsArticle) {
            setCurrentNewsArticle({
                ...currentNewsArticle,
                [name]: value
            });
        }
    };
    
    const handleDateChange = (date: Dayjs | null) => {
        console.log(date);
        if (currentNewsArticle) {
            setCurrentNewsArticle({
                ...currentNewsArticle,
                published_date: date?.format('YYYY-MM-DD') || ''
            });
        }
        console.log(currentNewsArticle);
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
                <Typography variant="h4" component="h1" fontWeight="medium">
                    Gestão de Notícias
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleDialogOpen()}
                    startIcon={<PostAdd />}
                    sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 'normal'
                    }}
                >
                    Adicionar notícia
                </Button>
            </Box>
            
            {newsArticles.length === 0 ? (
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
                            <PostAdd sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3 }} />
                            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                                Nenhuma notícia disponível
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            ) : (
            <>
                <Grid container spacing={3}>
                    {newsArticles.map((newsArticle, index) => (
                        <Grid key={index} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    opacity: newsArticle.active ? 1 : 0.6,
                                    position: 'relative',
                                    height: '100%',
                                }}
                                variant="outlined"
                            >
                                {newsArticle.pinned && (
                                    <Box sx={{ 
                                        position: 'absolute',
                                        top: 10,
                                        left: 10,
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        borderRadius: 5,
                                        px: 1,
                                        py: 0.5,
                                        fontSize: '0.8rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5
                                    }}>
                                        <PushPin fontSize="small" />
                                        Destaque
                                    </Box>
                                )}
                                <CardMedia
                                    component="img"
                                    height="200"
                                    sx={{ objectFit: 'cover', maxHeight: '200px' }}
                                    image={newsArticle.main_image
                                        ? `../backend${newsArticle.main_image}`
                                        : '../backend/media/images/glebsat-front.png'
                                    }
                                    alt={newsArticle.title || 'Imagem da notícia'}
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="div" sx={{ mb: 2 }}>
                                            {newsArticle.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <CalendarMonthRounded sx={{ mr: 0.5, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {newsArticle.published_date ? 
                                                    new Date(newsArticle.published_date).toLocaleDateString('pt-PT', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    }) : 
                                                    ''}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {newsArticle.summary}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'flex-end', alignItems: 'center', p: 2 }}>
                                        <IconButton 
                                            aria-label="more" 
                                            onClick={(e) => handleMenuOpen(e, index)}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </CardActions>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => {
                        if (currentMenuIndex !== null) {
                            handleDialogOpen(newsArticles[currentMenuIndex]);
                        }
                    }}>
                        <Edit fontSize="small" sx={{ mr: 1 }} />
                        Editar
                    </MenuItem>
                    <MenuItem onClick={handleTogglePinned}>
                        <PushPin fontSize="small" sx={{ mr: 1 }} />
                        {currentMenuIndex !== null && newsArticles[currentMenuIndex].pinned 
                            ? 'Desafixar'
                            : 'Afixar'
                        }
                    </MenuItem>
                    <MenuItem onClick={handleToggleActive}>
                        {currentMenuIndex !== null && newsArticles[currentMenuIndex].active 
                            ? (
                                <>
                                    <ToggleOff fontSize="small" sx={{ mr: 1 }} />
                                    Desativar
                                </>
                            ) : (
                                <>
                                    <ToggleOn fontSize="small" sx={{ mr: 1 }} />
                                    Ativar
                                </>
                            )
                        }
                    </MenuItem>
                </Menu>
            </>
            )}
            
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
                    {currentNewsArticle && currentNewsArticle.id !== 0 ? 'Editar Notícia' : 'Nova Notícia'}
                </DialogTitle>
                <DialogContent sx={{ px: 4, py: 3 }}>                
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            <FormControl>
                                <FormLabel 
                                    htmlFor="title"
                                    sx={{ 
                                        mb: 1, 
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Título
                                </FormLabel>
                                <TextField
                                    id="title"
                                    type="text"
                                    name="title"
                                    required
                                    fullWidth
                                    placeholder="Título da notícia"
                                    variant="outlined"
                                    value={currentNewsArticle?.title || ''}
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
                                    htmlFor="content"
                                    sx={{ 
                                        mb: 1, 
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Conteúdo da Notícia
                                </FormLabel>
                                <TextField
                                    id="content"
                                    type="text"
                                    name="content"
                                    required
                                    fullWidth
                                    multiline
                                    minRows={4}
                                    maxRows={10}
                                    placeholder="Conteúdo completo da notícia"
                                    variant="outlined"
                                    value={currentNewsArticle?.content || ''}
                                    onChange={handleInputChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                        }
                                    }}
                                />
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
                                            checked={currentNewsArticle?.active ?? true} 
                                            onChange={(e) => {
                                                if (currentNewsArticle) {
                                                    setCurrentNewsArticle({
                                                        ...currentNewsArticle,
                                                        active: e.target.checked
                                                    });
                                                }
                                            }}
                                            sx={{ mr: 3.5, left: 15 }}
                                        />
                                    }
                                    label="Ativar notícia"
                                />
                                <FormControlLabel
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '0.875rem'
                                        }
                                    }}
                                    control={
                                        <AntSwitch 
                                            checked={currentNewsArticle?.pinned ?? false} 
                                            onChange={(e) => {
                                                if (currentNewsArticle) {
                                                    setCurrentNewsArticle({
                                                        ...currentNewsArticle,
                                                        pinned: e.target.checked
                                                    });
                                                }
                                            }}
                                            sx={{ mr: 3.5, left: 15 }}
                                        />
                                    }
                                    label="Afixar notícia"
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

const ManageNews = () => {
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
            <NewsContent />
        </SnackbarProvider>
    );
}

export default ManageNews;