import { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Grid2 as Grid, Card, IconButton, useTheme, CircularProgress
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

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

const GalleryPage = () => {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [galleryByCategory, setGalleryByCategory] = useState<{[key: string]: any[]}>({});

  // Fetch categories and images from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/category`);
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.categories);
          console.log('Categories loaded:', data.categories);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchImages = async () => {
      try {
        const response = await fetch(`${API_URL}/image`);
        const data = await response.json();
        
        if (data.success) {
          // Format image URLs properly
          const activeImages = data.images
            .filter((img: GalleryImage) => img.active)
            .map((img: GalleryImage) => ({
              ...img,
              image: img.image.startsWith('../backend') ? img.image : '../backend' + img.image,
            }));
            
          setImages(activeImages);
          console.log('Images loaded:', activeImages);
        }
      } catch (err) {
        console.error('Error fetching images:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchImages();
  }, []);

  // Organize images by category when either images or categories change
  useEffect(() => {
    if (categories.length > 0 && images.length > 0) {
      const organizedGallery: {[key: string]: any[]} = {};
      
      categories.forEach(category => {
        const categoryImages = images
          .filter(image => image.category === category.id)
          .map(image => ({
            id: image.id,
            url: image.image,
            title: image.name
          }));
          
        if (categoryImages.length > 0) {
          organizedGallery[category.name] = categoryImages;
        }
      });
      
      setGalleryByCategory(organizedGallery);
    }
  }, [categories, images]);

  // Image Modal Component
  const ImageModal = ({ image, onClose }) => {
    if (!image) return null;
    
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)',
            padding: 16
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90%',
              overflow: 'hidden',
              borderRadius: 16
            }}
          >
            <IconButton 
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                }
              }}
            >
              <Close />
            </IconButton>
            
            <Box sx={{ 
              width: '100%', 
              maxWidth: '1200px',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.3)'
            }}>
              <Box
                component="img"
                src={image.url}
                alt={image.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </Box>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Gallery Section Component
  const GallerySection = ({ title, images }) => (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.8 }}
      sx={{ mb: 10 }}
    >
      <Typography 
        component={motion.h2}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
        variant="h4" 
        fontWeight="bold" 
        className="color-primary"
        sx={{ mb: 4 }}
      >
        {title}
      </Typography>
      
      <Grid container spacing={3}>
        {images.map((image, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={image.id}>
            <Card 
              component={motion.div}
              whileHover={{ 
                y: -10, 
                boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              elevation={4}
              sx={{ 
                borderRadius: 4,
                overflow: 'hidden',
                cursor: 'pointer',
                height: '100%',
                display: 'block',
                position: 'relative'
              }}
              onClick={() => setSelectedImage(image)}
              className="gallery-card"
            >
              <Box 
                sx={{ 
                  position: 'relative',
                  paddingTop: '75%', // 4:3 aspect ratio
                  overflow: 'hidden'
                }}
              >
                <Box
                  component={motion.img}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  src={image.url}
                  alt={image.title}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  className="image-overlay"
                />
                
                <Box 
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                    p: 3
                  }}
                >
                  <Box 
                    component={motion.div}
                    initial={{ y: 20 }}
                    whileHover={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                    sx={{ textAlign: 'center' }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'white',
                        fontWeight: 'bold',
                        textShadow: '0px 2px 4px rgba(0,0,0,0.5)'
                      }}
                    >
                      {image.title}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 8 }} className="gallery-container">
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
          Galeria de Imagens
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
          Explora a jornada visual da nossa missão através de imagens de todas as etapas do nosso projeto!
        </Typography>
      </Box>
      
      <Container maxWidth="xl">
      {Object.keys(galleryByCategory).length === 0 ? (
          <Typography 
            variant="h5" 
            align="center" 
            className="color-secondary"
            sx={{ my: 10 }}
          >
            Ainda não existem imagens na galeria
          </Typography>
        ) : (
          Object.entries(galleryByCategory).map(([categoryName, categoryImages]) => (
            <GallerySection key={categoryName} title={categoryName} images={categoryImages} />
          ))
        )}
      </Container>

      {/* Modal for enlarged image view */}
      <ImageModal 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </Box>
  );
};

export default GalleryPage;