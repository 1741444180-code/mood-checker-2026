'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import LogTable from '@/components/admin/log-table';

// Mock log data
const initialLogs = [
  { id: 1, timestamp: '2023-05-15 10:30:22', level: 'INFO', user: 'admin@example.com', action: 'Login', ip: '192.168.1.100', details: 'Successful login' },
  { id: 2, timestamp: '2023-05-15 10:31:45', level: 'WARN', user: 'user1@example.com', action: 'Password Reset', ip: '192.168.1.101', details: 'Password reset requested' },
  { id: 3, timestamp: '2023-05-15 10:32:10', level: 'ERROR', user: 'user2@example.com', action: 'Payment Failed', ip: '192.168.1.102', details: 'Insufficient funds' },
  { id: 4, timestamp: '2023-05-15 10:35:01', level: 'INFO', user: 'admin@example.com', action: 'Settings Updated', ip: '192.168.1.100', details: 'Updated system settings' },
  { id: 5, timestamp: '2023-05-15 10:40:33', level: 'INFO', user: 'user3@example.com', action: 'Profile Update', ip: '192.168.1.103', details: 'Updated profile information' },
  { id: 6, timestamp: '2023-05-15 10:45:22', level: 'DEBUG', user: 'system', action: 'Cron Job', ip: '127.0.0.1', details: 'Running daily cleanup' },
  { id: 7, timestamp: '2023-05-15 10:50:11', level: 'WARN', user: 'user4@example.com', action: 'Invalid Login', ip: '192.168.1.104', details: 'Failed login attempt' },
  { id: 8, timestamp: '2023-05-15 10:55:44', level: 'INFO', user: 'admin@example.com', action: 'User Created', ip: '192.168.1.100', details: 'Created new user account' },
  { id: 9, timestamp: '2023-05-15 11:00:15', level: 'ERROR', user: 'system', action: 'Database Error', ip: '127.0.0.1', details: 'Connection timeout' },
  { id: 10, timestamp: '2023-05-15 11:05:30', level: 'INFO', user: 'user5@example.com', action: 'Export Data', ip: '192.168.1.105', details: 'Exported user data' },
];

export default function LogsPage() {
  const [logs, setLogs] = useState(initialLogs);
  const [filteredLogs, setFilteredLogs] = useState(initialLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(5);

  // Filter logs based on search term and selected level
  useEffect(() => {
    let result = initialLogs;
    
    if (searchTerm) {
      result = result.filter(log => 
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip.includes(searchTerm)
      );
    }
    
    if (selectedLevel !== 'ALL') {
      result = result.filter(log => log.level === selectedLevel);
    }
    
    setFilteredLogs(result);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, selectedLevel]);

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Log Audit</h1>
        <p className="text-gray-600 mt-2">System logs and activity monitoring</p>
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Logs</p>
            <p className="text-2xl font-bold">{initialLogs.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Errors</p>
            <p className="text-2xl font-bold text-red-600">
              {initialLogs.filter(log => log.level === 'ERROR').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Warnings</p>
            <p className="text-2xl font-bold text-yellow-600">
              {initialLogs.filter(log => log.level === 'WARN').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Today</p>
            <p className="text-2xl font-bold text-blue-600">
              {initialLogs.filter(log => log.timestamp.startsWith('2023-05-15')).length}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>Recent system activities and events</CardDescription>
        </CardHeader>
        <CardContent>
          <LogTable 
            logs={currentLogs} 
            onSearchChange={handleSearchChange}
            onLevelChange={handleLevelChange}
          />
          
          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstLog + 1}-{Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} logs
            </p>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(i + 1);
                      }}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}