import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Pagination } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

interface FAQListProps {
  faqs: FAQ[];
}

const FAQList: React.FC<FAQListProps> = ({ faqs }) => {
  const [expandedId, setExpandedId] = useState<number | false>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleChange = (id: number) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedId(isExpanded ? id : false);
  };

  // 分页逻辑
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFAQs = faqs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(faqs.length / itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box>
      {currentFAQs.length > 0 ? (
        <>
          {currentFAQs.map((faq) => (
            <Accordion 
              key={faq.id} 
              expanded={expandedId === faq.id} 
              onChange={handleChange(faq.id)}
              sx={{ 
                mb: 2, 
                borderRadius: 2, 
                boxShadow: 2,
                '&:before': {
                  display: 'none'
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: '#fafafa',
                  borderRadius: '8px 8px 0 0',
                  '&.Mui-expanded': {
                    borderRadius: '8px 8px 0 0',
                  }
                }}
              >
                <Typography variant="h6">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '0 0 8px 8px',
                  '&.Mui-expanded': {
                    borderRadius: '0 0 8px 8px',
                  }
                }}
              >
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
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
        </>
      ) : (
        <Typography variant="h6" align="center" sx={{ py: 4 }}>
          没有找到相关问题，请尝试其他关键词。
        </Typography>
      )}
    </Box>
  );
};

export default FAQList;