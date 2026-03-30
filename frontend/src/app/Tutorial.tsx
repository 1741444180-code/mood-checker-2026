import React, { useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

interface Tutorial {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
}

interface TutorialProps {
  tutorials: Tutorial[];
}

const Tutorial: React.FC<TutorialProps> = ({ tutorials }) => {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const openTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
  };

  const closeTutorial = () => {
    setSelectedTutorial(null);
  };

  return (
    <Box>
      {tutorials.length > 0 ? (
        <Grid container spacing={3}>
          {tutorials.map((tutorial) => (
            <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 2, 
                  boxShadow: 2,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardMedia
                  sx={{ 
                    height: 140, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#f0f0f0'
                  }}
                  image={`https://picsum.photos/300/140?random=${tutorial.id}`}
                  title={tutorial.title}
                >
                  <IconButton
                    size="large"
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <PlayCircleOutlineIcon fontSize="large" />
                  </IconButton>
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {tutorial.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tutorial.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => openTutorial(tutorial)}
                  >
                    开始学习
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" align="center" sx={{ py: 4 }}>
          没有找到相关教程，请尝试其他关键词。
        </Typography>
      )}

      {/* 教程播放对话框 */}
      <Dialog
        open={!!selectedTutorial}
        onClose={closeTutorial}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3
          }
        }}
      >
        {selectedTutorial && (
          <>
            <DialogTitle 
              sx={{ 
                backgroundColor: '#f5f5f5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {selectedTutorial.title}
              <IconButton onClick={closeTutorial}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
              <Box sx={{ width: '100%', position: 'relative', paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
                <Box
                  component="iframe"
                  src={selectedTutorial.videoUrl}
                  title={selectedTutorial.title}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
              <Box sx={{ p: 3 }}>
                <Typography variant="body1" paragraph>
                  {selectedTutorial.description}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  教程内容概述:
                </Typography>
                <Typography variant="body1" paragraph>
                  本教程将引导您完成整个学习过程，包括基础概念介绍、实际操作演示以及常见问题解答。
                </Typography>
                <Typography variant="h6" gutterBottom>
                  学习目标:
                </Typography>
                <ul>
                  <li>掌握核心功能的使用方法</li>
                  <li>了解最佳实践建议</li>
                  <li>学会解决问题的技巧</li>
                </ul>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeTutorial}>关闭</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Tutorial;