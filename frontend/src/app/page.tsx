'use client';

import React, { useState } from 'react';
import { Box, Container, TextField, InputAdornment, Typography, Tabs, Tab, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FAQList from '@/components/FAQList';
import UserGuide from '@/components/UserGuide';
import Tutorial from '@/components/Tutorial';

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filtered content based on search term
  const filteredFAQs = [
    {
      id: 1,
      question: "如何注册账户？",
      answer: "点击首页右上角的“注册”按钮，填写相关信息即可完成注册。"
    },
    {
      id: 2,
      question: "忘记密码怎么办？",
      answer: "在登录页面点击“忘记密码”，按照提示操作即可重置密码。"
    },
    {
      id: 3,
      question: "如何修改个人信息？",
      answer: "登录后进入个人中心，点击编辑按钮即可修改个人信息。"
    },
    {
      id: 4,
      question: "如何联系客服？",
      answer: "您可以通过在线客服、邮箱或电话联系我们，联系方式在页面底部可以找到。"
    }
  ].filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGuides = [
    {
      id: 1,
      title: "快速入门指南",
      content: "本指南将帮助您快速了解系统的基本功能和操作方法。"
    },
    {
      id: 2,
      title: "高级功能使用",
      content: "深入了解系统的高级功能，提升工作效率。"
    }
  ].filter(guide => 
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTutorials = [
    {
      id: 1,
      title: "视频教程",
      description: "通过视频学习系统的核心功能。",
      videoUrl: "#"
    },
    {
      id: 2,
      title: "图文教程",
      description: "详细的图文说明，手把手教学。",
      videoUrl: "#"
    }
  ].filter(tutorial => 
    tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        帮助中心
      </Typography>
      
      {/* 搜索框 */}
      <Paper elevation={3} sx={{ p: 2, mb: 4, borderRadius: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索帮助文档..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* 标签页 */}
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{
            backgroundColor: '#f5f5f5',
            '.Mui-selected': {
              color: '#1976d2',
            }
          }}
        >
          <Tab label="常见问题 (FAQ)" />
          <Tab label="用户指南" />
          <Tab label="教程" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && <FAQList faqs={filteredFAQs} />}
          {tabValue === 1 && <UserGuide guides={filteredGuides} />}
          {tabValue === 2 && <Tutorial tutorials={filteredTutorials} />}
        </Box>
      </Paper>
    </Container>
  );
};

export default HelpPage;