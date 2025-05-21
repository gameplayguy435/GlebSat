import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Box, Container, Typography, Button, CircularProgress, 
  Card, CardMedia, IconButton, Paper
} from '@mui/material';
import { 
  ArrowBack, CalendarMonthRounded, NavigateNext, NavigateBefore 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Carousel from 'react-material-ui-carousel'
import MuiMarkdown from 'mui-markdown';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

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

interface Image {
  id: number;
  name: string;
  image: string;
  category: number | null;
  news_article: number;
  active: boolean;
}

const NewsArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchNewsArticle = async () => {
      try {
        setLoading(true);

        const newsResponse = await fetch(`${API_URL}/newsarticle/${id}`);
        const newsData = await newsResponse.json();
        
        if (!newsData.success || !newsData.news_article) {
          console.error('Error fetching news article:', newsData.message);
          setLoading(false);
          return;
        }
          
        setArticle(newsData.news_article);
        
        const imagesResponse = await fetch(`${API_URL}/image`);
        const imagesData = await imagesResponse.json();
        
        if (imagesData.success && imagesData.images) {
          const articleImages = imagesData.images
            .filter((img: Image) => img.news_article === parseInt(id as string) && img.active)
            .map((img: Image) => ({
            ...img,
            image: img.image.startsWith('../../backend') ? img.image : '../../backend' + img.image,
          }));
          
          setImages(articleImages);
        }
      } catch (error) {
        console.error('Error fetching news article:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsArticle();
  }, [id]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

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

  if (!article) {
    return (
      <Box sx={{ minHeight: '100vh', py: 8, textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" className="color-primary" sx={{ my: 4 }}>
            Artigo não encontrado
          </Typography>
          <Button 
            component={Link} 
            to="/news" 
            variant="contained" 
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Voltar às Notícias
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 8 }} className="article-container">
      <Container maxWidth="lg">
        <Button 
          component={Link}
          to="/news"
          startIcon={<ArrowBack />}
          variant="contained"
          color="primary"
          sx={{ mb: 4, textTransform: 'none' }}
        >
          Voltar às Notícias
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h3" 
            component="h1"
            fontWeight="bold" 
            className="color-primary"
            sx={{ mb: 2 }}
          >
            {article.title}
          </Typography>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 4 
            }}
            className="color-secondary"
          >
            <CalendarMonthRounded sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body1">
              {new Date(article.published_date).toLocaleDateString('pt-PT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </Box>

          {images.length > 0 && (
            <Box sx={{ mb: 6, position: 'relative' }}>
              <Carousel
                autoPlay={true}
                animation="slide"
                interval={6000}
                timeout={500}
                stopAutoPlayOnHover={false}
                navButtonsAlwaysVisible={false}
                navButtonsProps={{
                  style: {
                    backgroundColor: 'var(--background-primary, #fcfcfc)',
                    color: 'var(--text-primary, #0b0e14)',
                    borderRadius: '50%',
                    padding: '8px',
                    opacity: 0.85
                  }
                }}
                navButtonsWrapperProps={{
                  style: {
                    top: '50%',
                    transform: 'translateY(-50%)',
                    position: 'absolute'
                  }
                }}
                indicatorContainerProps={{
                  style: {
                    marginTop: 8,
                    textAlign: 'center'
                  }
                }}
                indicatorIconButtonProps={{
                  style: {
                    padding: 3,
                    color: 'rgba(100,100,100,0.2)',
                  }
                }}
                activeIndicatorIconButtonProps={{
                  style: {
                    color: 'var(--accent-color, #1976d2)'
                  }
                }}
                onChange={(now) => setCurrentImageIndex(now)}
              >
                {images.map((image, index) => (
                  <Card 
                    key={index}
                    sx={{ 
                      borderRadius: 2, 
                      overflow: 'hidden',
                      boxShadow: 0
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="500"
                      image={image.image}
                      alt={image.name || article.title}
                      sx={{ 
                        objectFit: 'contain', 
                        bgcolor: 'var(--background-primary)',
                        maxHeight: { xs: '350px', sm: '400px', md: '500px' },
                        width: '100%'
                      }}
                    />
                  </Card>
                ))}
              </Carousel>
            </Box>
          )}
          
            <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 3, md: 5 }, 
                borderRadius: 2,
                bgcolor: 'transparent',
                color: 'var(--text-primary, #000000)',
                typography: 'body1',
                lineHeight: 1.7,
              }}
              className="article-content"
            >
            {article.content}
            </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NewsArticlePage;