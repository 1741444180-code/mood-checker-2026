import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Pagination, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Guide {
  id: number;
  title: string;
  content: string;
}

interface UserGuideProps {
  guides: Guide[];
}

const UserGuide: React.FC<UserGuideProps> = ({ guides }) => {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const openGuide = (guide: Guide) => {
    setSelectedGuide(guide);
  };

  const closeGuide = () => {
    setSelectedGuide(null);
  };

  // 分页逻辑
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGuides = guides.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(guides.length / itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
      {currentGuides.length > 0 ? (
        <>
          {currentGuides.map((guide) => (
            <Card 
              key={guide.id} 
              sx={{ 
                mb: 3, 
                borderRadius: 2, 
                boxShadow: 2,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {guide.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {guide.content}
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => openGuide(guide)}
                  sx={{ mt: 1 }}
                >
                  查看详细指南
                </Button>
              </CardContent>
            </Card>
          ))}

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}

          {/* 详细指南对话框 */}
          <Dialog
            open={!!selectedGuide}
            onClose={closeGuide}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                maxHeight: '80vh'
              }
            }}
          >
            {selectedGuide && (
              <>
                <DialogTitle 
                  sx={{ 
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  {selectedGuide.title}
                  <IconButton onClick={closeGuide}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                  <Typography variant="body1" paragraph>
                    {selectedGuide.content}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    这里是更详细的用户指南内容。您可以在这里找到关于该主题的全面说明。
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    步骤 1: 准备工作
                  </Typography>
                  <Typography variant="body1" paragraph>
                    在开始之前，请确保您已经完成了必要的准备工作，例如登录您的账户并熟悉基本界面。
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    步骤 2: 操作流程
                  </Typography>
                  <Typography variant="body1" paragraph>
                    按照以下步骤进行操作，每个步骤都有详细的说明和截图指导。
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    步骤 3: 验证结果
                  </Typography>
                  <Typography variant="body1" paragraph>
                    完成操作后，验证结果是否符合预期。如果遇到问题，请参考故障排除部分。
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={closeGuide}>关闭</Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </>
      ) : (
        <Typography variant="h6" align="center" sx={{ py: 4 }}>
          没有找到相关指南，请尝试其他关键词。
        </Typography>
      )}
    </Box>
  );
};

export default UserGuide;