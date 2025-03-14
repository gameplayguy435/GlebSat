import { useState } from 'react';
import { 
  Box, Container, Typography, Grid2 as Grid, Card, Paper, IconButton, useTheme
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const GalleryPage = () => {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);

  // Gallery categories and images
  const galleries = {
    development: [
      { id: 1, url: "/images/glebsat-front.png", title: "Montagem do Protótipo Inicial" },
      { id: 2, url: "/images/glebsat-equipa1.jpg", title: "Calibração de Sensores" },
      { id: 3, url: "/api/placeholder/400/300", title: "Fase de Testes" }
    ],
    mission: [
      { id: 4, url: "/api/placeholder/400/300", title: "Preparação para Lançamento" },
      { id: 5, url: "/api/placeholder/400/300", title: "Implementação" },
      { id: 6, url: "/api/placeholder/400/300", title: "Primeiras Imagens Orbitais" }
    ],
    process: [
      { id: 7, url: "/images/david.jpg", title: "Sessão de Planeamento da Equipa" },
      { id: 8, url: "/images/ricardo.jpg", title: "Integração de Componentes" },
      { id: 9, url: "/images/rafael.jpg", title: "Controlo de Qualidade" },
      { id: 10, url: "/images/guilherme.jpg", title: "Design do Satélite" }
    ]
  };

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
        {/* Gallery Sections */}
        <GallerySection title="Processo de Desenvolvimento" images={galleries.development} />
        <GallerySection title="Imagens da Missão" images={galleries.mission} />
        <GallerySection title="Documentação do Processo" images={galleries.process} />
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