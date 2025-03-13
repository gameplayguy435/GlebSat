import { useState, useEffect, MouseEvent } from 'react';
import { 
    Alert,
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
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid2 as Grid,
    IconButton,
    Menu,
    MenuItem,
    Snackbar,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { 
    AddCircleOutlineRounded,
    CalendarMonthRounded,
    Delete,
    Edit,
    MoreVert,
    PushPin,
    RemoveCircleOutlineRounded,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { newsService, NewsArticle } from '../services/News';
import CustomDatePicker from './components/CustomDatePicker';
import placeholderImage from '../assets/images/placeholder.jpg';

const Content = () => {  
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentNews, setCurrentNews] = useState<NewsArticle | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [fileInput, setFileInput] = useState<File | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentMenuIndex, setCurrentMenuIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchNews();
    }, []);
      
    const fetchNews = async () => {
        // try {
        //     setLoading(true);
        //     const response = await newsService.getAll();
        //     setNews(response.data);
        // } catch (err) {
        //     setError('Failed to fetch news articles');
        //     console.error(err);
        // } finally {
        //     setLoading(false);
        // }
    };

    const handleDialogOpen = () => {
        // SE FOR EDIT PEGA NOS DADOS E METE NO INPUT
        // setCurrentNews(article || { 
        //     title: '', 
        //     content: '', 
        //     published_date: new Date().toISOString().split('T')[0]
        // });
        setDialogOpen(true);
        handleMenuClose();
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
        setCurrentNews(null);
    };

    const handleMenuOpen = (e: MouseEvent<HTMLElement>, index: number) => {
        setAnchorEl(e.currentTarget);
        setCurrentMenuIndex(index);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setCurrentMenuIndex(null);
    };
    
    // const handleSave = async () => {
    //     if (!currentNews) return;
        
    //     try {
    //         setLoading(true);
            
    //         const newsData = {
    //             ...currentNews,
    //             image: fileInput
    //         };
            
    //         if (currentNews.id) {
    //             // Update
    //             await newsService.update(currentNews.id, newsData);
    //             setSnackbar({ open: true, message: 'News updated successfully!', severity: 'success' });
    //         } else {
    //             // Create
    //             await newsService.create(newsData);
    //             setSnackbar({ open: true, message: 'News created successfully!', severity: 'success' });
    //         }
    //         fetchNews();
    //         handleDialogClose();
    //     } catch (err) {
    //         setSnackbar({ open: true, message: 'Operation failed!', severity: 'error' });
    //         console.error(err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
      
    // const handleDelete = async (id: number) => {
    //     try {
    //         setLoading(true);
    //         await newsService.delete(id);
    //         setSnackbar({ open: true, message: 'News deleted successfully!', severity: 'success' });
    //         fetchNews();
    //     } catch (err) {
    //         setSnackbar({ open: true, message: 'Delete failed!', severity: 'error' });
    //         console.error(err);
    //     } finally {
    //         setLoading(false);
    //         handleMenuClose();
    //     }
    // };
      
    // const handleTogglePin = (article: NewsArticle) => {
    //     // This would update the pinned status in your backend
    //     // For now we'll just update locally
    //     if (article.id) {
    //         const updatedNews = news.map(item => {
    //             if (item.id === article.id) {
    //                 return {...item, pinned: !item.pinned};
    //             }
    //             return item;
    //         });
    //         setNews(updatedNews);
    //         setSnackbar({ 
    //             open: true, 
    //             message: `Article ${article.pinned ? 'unpinned' : 'pinned'} successfully!`, 
    //             severity: 'success' 
    //         });
    //     }
    //     handleMenuClose();
    // };
      
    // const handleToggleActive = (article: NewsArticle) => {
    //     // This would update the active status in your backend
    //     // For now we'll just update locally
    //     if (article.id) {
    //         const updatedNews = news.map(item => {
    //             if (item.id === article.id) {
    //                 return {...item, active: !item.active};
    //             }
    //             return item;
    //         });
    //         setNews(updatedNews);
    //         setSnackbar({ 
    //             open: true, 
    //             message: `Article ${article.active ? 'deactivated' : 'activated'} successfully!`, 
    //             severity: 'success' 
    //         });
    //     }
    //     handleMenuClose();
    // };
      
    // // Render loading state
    // if (loading && news.length === 0) {
    //     return (
    //         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    //             <CircularProgress />
    //         </Box>
    //     );
    // }
      
    // // Render error state
    // if (error) {
    //     return (
    //         <Box sx={{ p: 3 }}>
    //             <Alert severity="error">{error}</Alert>
    //         </Box>
    //     );
    // }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Gestão de Notícias
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleDialogOpen()}
                >
                    Adicionar Notícia
                </Button>
            </Box>
            
            {/* News Grid */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                    <Card 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                        }}
                        variant="outlined"
                    >
                        <CardMedia
                            component="img"
                            height="200"
                            image={placeholderImage}
                        />
                        <PushPin 
                            sx={{ 
                            position: 'absolute', 
                            top: 10, 
                            right: 10,
                            color: 'primary.main',
                            bgcolor: 'white',
                            borderRadius: '50%',
                            p: 0.5
                            }}
                        />
                        <Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="div" sx={{ mb: 2 }}>
                                    Lorem Ipsum dolor sit amet
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <CalendarMonthRounded sx={{ mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        12-01-2025
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end', alignItems: 'start', mr: 0 }}>
                                <IconButton 
                                    aria-label="more" 
                                    onClick={(e) => handleMenuOpen(e, 0)}
                                >
                                    <MoreVert />
                                </IconButton>
                            </CardActions>
                        </Box>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                    <Card 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                        }}
                        variant="outlined"
                    >
                        <CardMedia
                            component="img"
                            height="200"
                            image={placeholderImage}
                        />
                        <PushPin 
                            sx={{ 
                            position: 'absolute', 
                            top: 10, 
                            right: 10,
                            color: 'primary.main',
                            bgcolor: 'white',
                            borderRadius: '50%',
                            p: 0.5
                            }}
                        />
                        <Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="div" sx={{ mb: 2 }}>
                                    Lorem Ipsum dolor sit amet
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <CalendarMonthRounded sx={{ mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        12-01-2025
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end', alignItems: 'start', mr: 0 }}>
                                <IconButton 
                                    aria-label="more" 
                                    onClick={(e) => handleMenuOpen(e, 0)}
                                >
                                    <MoreVert />
                                </IconButton>
                            </CardActions>
                        </Box>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                    <Card 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                        }}
                        variant="outlined"
                    >
                        <CardMedia
                            component="img"
                            height="200"
                            image={placeholderImage}
                        />
                        <PushPin 
                            sx={{ 
                            position: 'absolute', 
                            top: 10, 
                            right: 10,
                            color: 'primary.main',
                            bgcolor: 'white',
                            borderRadius: '50%',
                            p: 0.5
                            }}
                        />
                        <Box>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="div" sx={{ mb: 2 }}>
                                    Lorem Ipsum dolor sit amet
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <CalendarMonthRounded sx={{ mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        12-01-2025
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ justifyContent: 'flex-end', alignItems: 'start', mr: 0 }}>
                                <IconButton 
                                    aria-label="more" 
                                    onClick={(e) => handleMenuOpen(e, 0)}
                                >
                                    <MoreVert />
                                </IconButton>
                            </CardActions>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem
                    // onClick={() => handleDialogOpen(news[currentMenuIndex])}
                >
                    <Edit fontSize="small" sx={{ mr: 1 }} />
                    Editar
                </MenuItem>
                <MenuItem
                    // onClick={() => handleTogglePin(news[currentMenuIndex])}
                >
                    {/* {news[currentMenuIndex].pinned ? (
                        <>
                            <PushPinOutlined fontSize="small" sx={{ mr: 1 }} />
                            Desafixar
                        </>
                    ) : (
                        <> */}
                            <PushPin fontSize="small" sx={{ mr: 1 }} />
                            Afixar
                        {/* </>
                    )} */}
                </MenuItem>
                <MenuItem 
                    // onClick={() => handleToggleActive(news[currentMenuIndex])}
                >
                    <AddCircleOutlineRounded fontSize="small" sx={{ mr: 1 }} />
                    Ativar
                    {/* {news[currentMenuIndex].active ? 'Desativar' : 'Ativar'} */}
                </MenuItem>
                <MenuItem 
                    // onClick={() => news[currentMenuIndex].id && handleDelete(news[currentMenuIndex].id!)}
                    sx={{ color: 'error.main' }}
                >
                    <Delete fontSize="small" sx={{ mr: 1 }} />
                    Apagar
                </MenuItem>
            </Menu>
            
            {/* Edit/Create Dialog */}
            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    Nova Notícia
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Preencha os campos abaixo para criar uma notícia.
                    </DialogContentText>
                
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            <FormControl>
                                <FormLabel htmlFor="title">Título</FormLabel>
                                <TextField
                                    id="title"
                                    type="text"
                                    name="title"
                                    required
                                    fullWidth
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="title">Data de Publicação</FormLabel>
                                <CustomDatePicker sx={{ textAlign: 'left' }} />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="summary">Resumo</FormLabel>
                                <TextField
                                    id="summary"
                                    type="text"
                                    name="summary"
                                    fullWidth
                                    multiline
                                    maxRows={4}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="content">Conteúdo da Notícia</FormLabel>
                                <TextField
                                    id="content"
                                    type="text"
                                    name="content"
                                    required
                                    fullWidth
                                    multiline
                                    maxRows={10}
                                />
                            </FormControl>
                            
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Switch 
                                            defaultChecked={true}
                                            // checked={currentNews?.active || false} 
                                            // onChange={e => setCurrentNews(prev => prev ? {...prev, active: e.target.checked} : null)}
                                        />
                                    }
                                    label="Ativo"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch 
                                            // checked={currentNews?.pinned || false} 
                                            // onChange={e => setCurrentNews(prev => prev ? {...prev, pinned: e.target.checked} : null)}
                                        />
                                    }
                                    label="Afixar notícia"
                                />
                            </Box>
                        </Stack>
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleDialogClose}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        // onClick={handleSave} 
                        variant="contained" 
                        // disabled={loading}
                    >
                        {/* {loading ? <CircularProgress size={24} /> : 'Guardar'} */}
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* Snackbar for feedback */}
            <Snackbar 
                open={false}
                autoHideDuration={6000} 
                // onClose={() => setSnackbar(prev => ({...prev, open: false}))}
            >
                <Alert 
                    severity="error"
                    variant="filled" 
                    //   onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                >
                    Parabens ganhou
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Content;