import { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Grid2 as Grid, Card, CardContent, 
  CardMedia, CardActions, Paper, Button, useTheme, Chip, CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { CalendarMonthRounded, ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || '';

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  published_date: string;
  author: number;
  active: boolean;
  pinned: boolean;
  main_image?: string | null;
}

const NewsPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [featuredNews, setFeaturedNews] = useState<NewsArticle[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  
  useEffect(() => {
    const fetchNewsArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/newsarticle`);
        const data = await response.json();
        
        if (data.success && data.news_articles) {
          const activeArticles = data.news_articles.filter(
            (article: NewsArticle) => article.active
          );
          
          const pinnedArticles = activeArticles.filter(
            (article: NewsArticle) => article.pinned
          );
          const remainingArticles = activeArticles.filter(
            (article: NewsArticle) => !article.pinned
          );
          
          console.log('Pinned Articles:', pinnedArticles);
          console.log('Remaining Articles:', remainingArticles);
          setFeaturedNews(pinnedArticles);
          setNewsArticles(remainingArticles);
        } else {
          console.error('Error fetching news articles:', data.message);
        }
      } catch (error) {
        console.error('Error fetching news articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsArticles();
  }, []);

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (featuredNews.length === 0 && newsArticles.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', py: 8, textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" className="color-primary" sx={{ my: 4 }}>
            Não existem notícias disponíveis de momento.
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 8 }} className="news-container">
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ 
          textAlign: 'center',
          mb: 8
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          fontWeight="bold" 
          className="color-primary"
        >
          Últimas Notícias
        </Typography>
        
        <Typography 
          variant="h6"
          component={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="color-secondary"
          sx={{ 
            maxWidth: '700px', 
            mx: 'auto', 
            mt: 2,
            px: 2
          }}
        >
          Acompanhe as atualizações mais recentes sobre o nosso projeto e avanços tecnológicos
        </Typography>
      </Box>
      
      <Container maxWidth="xl">
        {featuredNews.length !== 0 && (
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            sx={{ mb: 8 }}
          >            
            {featuredNews.map((newsArticle, index) => (
              <Card 
                key={index}
                component={motion.div}
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                elevation={3}
                className="bg-secondary"
                sx={{ 
                  borderRadius: 4, 
                  overflow: 'hidden',
                  mb: 4,
                }}
              >
                <Grid container>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CardMedia
                      component="img"
                      sx={{ 
                        height: { xs: '240px', md: '100%' },
                        objectFit: 'cover'
                      }}
                      image={newsArticle.main_image
                        ? `../backend${newsArticle.main_image}`
                        : "../backend/media/images/glebsat-front.png"
                      }
                      alt={newsArticle.title}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CardContent sx={{ 
                      p: 4,
                      display: 'flex', 
                      flexDirection: 'column',
                      height: '100%' 
                    }}>
                      <Box>
                        <Chip 
                          label="Destaque"
                          color="primary" 
                          size="small"
                          sx={{ mb: 2 }}
                        />
                        <Typography 
                          variant="h4" 
                          component="h3" 
                          gutterBottom 
                          className="color-primary"
                          fontWeight="bold"
                        >
                          {newsArticle.title}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ mb: 3 }} 
                          className="color-secondary"
                        >
                          {newsArticle.summary}
                        </Typography>
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mb: 3 
                          }}
                          className="color-secondary"
                        >
                          <CalendarMonthRounded sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="body2">
                            {new Date(newsArticle.published_date).toLocaleDateString('pt-PT', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mt: 'auto' }}>
                      <Button
                        component={Link}
                        to={`/news/article/${newsArticle.id}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        variant="contained"
                        color="primary"
                        endIcon={<ArrowForward />}
                        sx={{ 
                          mt: 2,
                          textTransform: 'none',
                          borderRadius: 2,
                          px: 3
                        }}
                      >
                          Ler Mais
                        </Button>
                      </Box>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Box>
        )}
        
        {newsArticles.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Grid container spacing={3}>
              {newsArticles.map((newsArticle, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Card 
                    component={motion.div}
                    whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    elevation={3}
                    className="bg-secondary"
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden'
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={newsArticle.main_image 
                        ? `../backend${newsArticle.main_image}` 
                        : "/images/placeholder.jpg"}
                      alt={newsArticle.title}
                      className="image-overlay"
                      sx={{ objectFit: 'cover' }}
                    />
                    
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        gutterBottom 
                        className="color-primary"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                      >
                        {newsArticle.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ mb: 3 }} 
                        className="color-secondary"
                      >
                        {newsArticle.summary}
                      </Typography>
                      
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 1
                        }}
                        className="color-secondary"
                      >
                        <CalendarMonthRounded sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body2">
                          {new Date(newsArticle.published_date).toLocaleDateString('pt-PT', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        component={Link}
                        to={`/news/article/${newsArticle.id}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        variant="contained"
                        color="primary"
                        endIcon={<ArrowForward />}
                        sx={{ 
                          mt: 2,
                          textTransform: 'none',
                          borderRadius: 2,
                          px: 3
                        }}
                      >
                        Ler Mais
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default NewsPage;