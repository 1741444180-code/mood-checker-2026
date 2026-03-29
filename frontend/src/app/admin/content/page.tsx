'use client';

import React, { useState, useEffect } from 'react';
import AdminWrapper from '../components/AdminWrapper';

const ContentPage = () => {
  const [contents, setContents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  
  const contentsPerPage = 10;

  // 模拟内容数据
  useEffect(() => {
    // 模拟API加载
    setTimeout(() => {
      const mockContents = [
        { id: 1, title: '如何提高工作效率', author: '张三', category: '生产力', status: 'pending', createdAt: '2023-11-15', views: 1200, likes: 45 },
        { id: 2, title: '最新科技趋势分析', author: '李四', category: '科技', status: 'approved', createdAt: '2023-11-16', views: 2500, likes: 120 },
        { id: 3, title: '健康饮食指南', author: '王五', category: '健康', status: 'rejected', createdAt: '2023-11-17', views: 800, likes: 20 },
        { id: 4, title: '旅游攻略分享', author: '赵六', category: '旅行', status: 'pending', createdAt: '2023-11-18', views: 3200, likes: 80 },
        { id: 5, title: '编程学习心得', author: '钱七', category: '教育', status: 'approved', createdAt: '2023-11-19', views: 1800, likes: 65 },
        { id: 6, title: '摄影技巧大全', author: '孙八', category: '艺术', status: 'approved', createdAt: '2023-11-20', views: 2100, likes: 95 },
        { id: 7, title: '理财投资建议', author: '周九', category: '财经', status: 'pending', createdAt: '2023-11-20', views: 1500, likes: 55 },
        { id: 8, title: '时尚穿搭指南', author: '吴十', category: '时尚', status: 'rejected', createdAt: '2023-11-19', views: 950, likes: 30 },
        { id: 9, title: '家居装饰灵感', author: '郑一', category: '生活', status: 'approved', createdAt: '2023-11-18', views: 1750, likes: 70 },
        { id: 10, title: '运动健身方法', author: '刘二', category: '健康', status: 'pending', createdAt: '2023-11-17', views: 1300, likes: 40 },
        { id: 11, title: '美食烹饪技巧', author: '陈三', category: '美食', status: 'approved', createdAt: '2023-11-16', views: 2400, likes: 110 },
        { id: 12, title: '读书推荐清单', author: '杨四', category: '教育', status: 'pending', createdAt: '2023-11-15', views: 1600, likes: 60 },
      ];
      setContents(mockContents);
      setLoading(false);
    }, 800);
  }, []);

  // 过滤内容
  const filteredContents = contents.filter(content => {
    const matchesSearch = 
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // 分页
  const indexOfLastContent = currentPage * contentsPerPage;
  const indexOfFirstContent = indexOfLastContent - contentsPerPage;
  const currentContents = filteredContents.slice(indexOfFirstContent, indexOfLastContent);
  const totalPages = Math.ceil(filteredContents.length / contentsPerPage);

  // 处理内容状态更改
  const handleStatusChange = (contentId, newStatus) => {
    setContents(contents.map(content => 
      content.id === contentId ? { ...content, status: newStatus } : content
    ));
    setShowModal(false);
  };

  // 打开确认模态框
  const openModal = (content, action) => {
    setSelectedContent(content);
    setModalAction(action);
    setShowModal(true);
  };

  // 获取状态标签
  const getStatusLabel = (status) => {
    switch(status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">已通过</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">已拒绝</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">待审核</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">未知</span>;
    }
  };

  return (
    <AdminWrapper title="内容管理" description="审核和管理用户提交的内容">
      {/* 搜索和过滤区 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索内容..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // 重置到第一页
                }}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div>
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1); // 重置到第一页
                }}
              >
                <option value="all">所有状态</option>
                <option value="pending">待审核</option>
                <option value="approved">已通过</option>
                <option value="rejected">已拒绝</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              批量操作
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
              导出数据
            </button>
          </div>
        </div>
      </div>

      {/* 内容列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">加载中...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标题</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建日期</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">互动</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentContents.length > 0 ? (
                    currentContents.map((content) => (
                      <tr key={content.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{content.title}</div>
                          <div className="text-sm text-gray-500 mt-1">{content.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{content.author}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{content.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusLabel(content.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{content.createdAt}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {content.views}
                            </span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                              </svg>
                              {content.likes}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="px-3 py-1 rounded text-sm bg-blue-100 text-blue-800 hover:bg-blue-200">
                              查看
                            </button>
                            {content.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => openModal(content, 'approve')}
                                  className="px-3 py-1 rounded text-sm bg-green-100 text-green-800 hover:bg-green-200"
                                >
                                  通过
                                </button>
                                <button 
                                  onClick={() => openModal(content, 'reject')}
                                  className="px-3 py-1 rounded text-sm bg-red-100 text-red-800 hover:bg-red-200"
                                >
                                  拒绝
                                </button>
                              </>
                            )}
                            <button className="px-3 py-1 rounded text-sm bg-red-100 text-red-800 hover:bg-red-200">
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p>未找到匹配的内容</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            {filteredContents.length > contentsPerPage && (
              <div className="bg-white px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    显示 <span className="font-medium">{indexOfFirstContent + 1}</span> 到{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastContent, filteredContents.length)}
                    </span>{' '}
                    条，共 <span className="font-medium">{filteredContents.length}</span> 条
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      上一页
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      下一页
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 确认模态框 */}
      {showModal && selectedContent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {modalAction === 'approve' && '审核通过内容'}
                      {modalAction === 'reject' && '拒绝内容'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        您确定要{modalAction === 'approve' ? '通过' : '拒绝'}内容 <strong>"{selectedContent.title}"</strong> 吗？
                      </p>
                      {modalAction === 'reject' && (
                        <div className="mt-3">
                          <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700 mb-1">
                            拒绝原因（可选）
                          </label>
                          <textarea
                            id="rejection-reason"
                            rows={3}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                            placeholder="请输入拒绝原因..."
                          ></textarea>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
                    modalAction === 'approve' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                  onClick={() => {
                    if (modalAction === 'approve') {
                      handleStatusChange(selectedContent.id, 'approved');
                    } else if (modalAction === 'reject') {
                      handleStatusChange(selectedContent.id, 'rejected');
                    }
                  }}
                >
                  {modalAction === 'approve' ? '通过内容' : '拒绝内容'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminWrapper>
  );
};

export default ContentPage;