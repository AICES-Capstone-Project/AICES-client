import React, { useState } from 'react';
import { Drawer, Typography, Upload, Button, Space, message, List, Progress } from 'antd';
import { InboxOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface UploadBatchDrawerProps {
  open: boolean;
  onClose: () => void;
  jobTitle: string;
  onUpload: (files: File[]) => Promise<boolean>;
  uploading: boolean;
}

const UploadBatchDrawer: React.FC<UploadBatchDrawerProps> = ({
  open,
  onClose,
  jobTitle,
  onUpload,
  uploading,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // Filter out files that are not PDF, DOC, or DOCX
    const validFiles = newFileList.filter(file => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type === 'application/msword' || 
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      if (!isValidType && file.originFileObj) {
        message.error(`${file.name} is not a valid file type. Only PDF, DOC, and DOCX files are allowed.`);
      }
      
      return isValidType;
    });
    
    setFileList(validFiles);
  };

  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter(item => item.uid !== file.uid);
    setFileList(newFileList);
  };

  const handleUploadAll = async () => {
    if (fileList.length === 0) {
      message.warning('Please select files to upload');
      return;
    }

    const files: File[] = [];
    for (const file of fileList) {
      if (file.originFileObj) {
        files.push(file.originFileObj as File);
      }
    }

    if (files.length === 0) {
      message.error('No valid files found');
      return;
    }

    try {
      await onUpload(files);
      // Clear file list on successful upload
      setFileList([]);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const uploadProps: UploadProps = {
    name: 'files',
    multiple: true,
    fileList,
    beforeUpload: () => false, // Prevent auto upload
    onChange: handleChange,
    onRemove: handleRemove,
    accept: '.pdf,.doc,.docx',
    showUploadList: false, // We'll show custom list below
  };

  return (
    <Drawer
      title="Upload Multiple CVs"
      placement="right"
      onClose={onClose}
      open={open}
      width={600}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose} disabled={uploading}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleUploadAll}
              loading={uploading}
              disabled={fileList.length === 0}
              icon={<UploadOutlined />}
            >
              Upload All ({fileList.length} files)
            </Button>
          </Space>
        </div>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ marginBottom: 8 }}>
          Job: {jobTitle}
        </Title>
        <Text type="secondary">
          Upload multiple CV files at once. Supported formats: PDF, DOC, DOCX
        </Text>
      </div>

      <Dragger {...uploadProps} style={{ marginBottom: 24 }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag files to this area to upload</p>
        <p className="ant-upload-hint">
          Support for multiple selection. Only PDF, DOC, and DOCX files are allowed.
        </p>
      </Dragger>

      {fileList.length > 0 && (
        <div>
          <Title level={5} style={{ marginBottom: 12 }}>
            Selected Files ({fileList.length})
          </Title>
          <List
            dataSource={fileList}
            renderItem={(file) => (
              <List.Item
                actions={[
                  <Button
                    key="remove"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove(file)}
                    disabled={uploading}
                  />
                ]}
              >
                <List.Item.Meta
                  title={file.name}
                  description={`${((file.size || 0) / 1024 / 1024).toFixed(2)} MB`}
                />
              </List.Item>
            )}
          />
        </div>
      )}

      {uploading && (
        <div style={{ marginTop: 16 }}>
          <Text>Uploading files...</Text>
          <Progress percent={100} status="active" showInfo={false} />
        </div>
      )}
    </Drawer>
  );
};

export default UploadBatchDrawer;