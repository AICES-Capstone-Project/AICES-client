import React from 'react';
import { Modal, Table, Tag, Typography, Space, Divider, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface UploadResult {
  fileName: string;
  status: 'Success' | 'Validation' | 'Error';
  message: string;
  data: {
    applicationId?: number;
    status?: string;
    originalFileName?: string;
  } | null;
}

interface BatchUploadResultData {
  totalFiles: number;
  successCount: number;
  failCount: number;
  results: UploadResult[];
}

interface BatchUploadResultModalProps {
  open: boolean;
  onClose: () => void;
  data: BatchUploadResultData | null;
}

const BatchUploadResultModal: React.FC<BatchUploadResultModalProps> = ({
  open,
  onClose,
  data,
}) => {
  if (!data) return null;

  const successResults = data.results.filter(r => r.status === 'Success');
  const failedResults = data.results.filter(r => r.status !== 'Success');

  const columns: ColumnsType<UploadResult> = [
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
      width: '45%',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip title={text}>
          <Text style={{ fontSize: '13px' }}>
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      align: 'center',
      render: (status: string) => {
        if (status === 'Success') {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Success
            </Tag>
          );
        }
        return (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Failed
          </Tag>
        );
      },
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      width: '35%',
      ellipsis: {
        showTitle: false,
      },
      render: (message: string, record: UploadResult) => {
        const color = record.status === 'Success' ? '#52c41a' : '#ff4d4f';
        return (
          <Tooltip title={message}>
            <Text style={{ fontSize: '13px', color }}>
              {message}
            </Text>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <Modal
      title={
        <Space direction="vertical" size={0}>
          <Title level={4} style={{ margin: 0 }}>
            Batch Upload Results
          </Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {data.totalFiles} files processed
          </Text>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Summary */}
        <Space size="large" style={{ width: '100%', justifyContent: 'center', padding: '16px 0', background: '#fafafa', borderRadius: '8px' }}>
          <Space direction="vertical" align="center" size={4}>
            <CheckCircleOutlined style={{ fontSize: 36, color: '#52c41a' }} />
            <Text strong style={{ fontSize: 24, color: '#52c41a' }}>
              {data.successCount}
            </Text>
            <Text type="secondary">Successful</Text>
          </Space>
          
          <Divider type="vertical" style={{ height: 70 }} />
          
          <Space direction="vertical" align="center" size={4}>
            <CloseCircleOutlined style={{ fontSize: 36, color: '#ff4d4f' }} />
            <Text strong style={{ fontSize: 24, color: '#ff4d4f' }}>
              {data.failCount}
            </Text>
            <Text type="secondary">Failed</Text>
          </Space>
        </Space>

        {/* Failed Files Section */}
        {failedResults.length > 0 && (
          <div>
            <Space style={{ marginBottom: 12 }}>
              <WarningOutlined style={{ color: '#ff4d4f', fontSize: 16 }} />
              <Text strong style={{ fontSize: 16 }}>
                Failed Files ({failedResults.length})
              </Text>
            </Space>
            <Table
              dataSource={failedResults}
              columns={columns}
              rowKey={(record) => record.fileName}
              pagination={failedResults.length > 10 ? { pageSize: 10, size: 'small' } : false}
              size="small"
              scroll={{ y: 300 }}
              style={{ marginBottom: 16 }}
            />
          </div>
        )}

        {/* Success Files Section */}
        {successResults.length > 0 && (
          <div>
            <Space style={{ marginBottom: 12 }}>
              <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
              <Text strong style={{ fontSize: 16 }}>
                Successful Files ({successResults.length})
              </Text>
            </Space>
            <Table
              dataSource={successResults}
              columns={columns}
              rowKey={(record) => record.fileName}
              pagination={successResults.length > 10 ? { pageSize: 10, size: 'small' } : false}
              size="small"
              scroll={{ y: 300 }}
            />
          </div>
        )}
      </Space>
    </Modal>
  );
};

export default BatchUploadResultModal;

