import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, Typography, Upload, Button, message, List, Progress, Alert, Tooltip } from 'antd';
import { InboxOutlined, UploadOutlined, InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { companySubscriptionService } from '../../../../services/companySubscriptionService';

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface UploadBatchDrawerProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => Promise<boolean>;
  uploading: boolean;
}

const UploadBatchDrawer: React.FC<UploadBatchDrawerProps> = ({
  open,
  onClose,
  onUpload,
  uploading,
}) => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isFreePlan, setIsFreePlan] = useState<boolean>(false);
  const [checkingPlan, setCheckingPlan] = useState<boolean>(false);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    const fetchPlan = async () => {
      setCheckingPlan(true);
      try {
        const res: any = await companySubscriptionService.getCurrentSubscription();
        const name = res?.data?.subscriptionName ?? res?.data ?? res?.subscriptionName ?? res?.subscription?.subscriptionName ?? null;
        const normalized = (typeof name === 'string' && name) ? name.toLowerCase() : null;
        if (mounted) setIsFreePlan(Boolean(normalized && normalized.includes('free')));
      } catch (err) {
        console.error('Failed to fetch subscription:', err);
      } finally {
        if (mounted) setCheckingPlan(false);
      }
    };
    fetchPlan();
    return () => { mounted = false; };
  }, [open]);

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    // Only accept PDF files
    const validFiles = newFileList.filter((file) => {
      const name = file.name || '';
      const isPdfByExt = /\.pdf$/i.test(name);
      const isPdfByType = file.type === 'application/pdf';
      const isValid = isPdfByExt || isPdfByType;

      if (!isValid && file.originFileObj) {
        message.error(`${file.name} is not a valid file type. Only PDF files are allowed.`);
      }

      return isValid;
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
    accept: '.pdf',
    showUploadList: false, // We'll show custom list below
  };

  const uploadDisabled = fileList.length === 0 || isFreePlan;

  return (
    <Drawer
      title="Upload Multiple Resumes"
      placement="right"
      onClose={onClose}
      open={open}
      width={600}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div />
          <div>
            <Button
              type="primary"
              onClick={handleUploadAll}
              loading={uploading}
              disabled={uploadDisabled}
              icon={<UploadOutlined style={{ color: uploadDisabled ? '#8c8c8c' : '#fff' }} />}
              style={
                uploadDisabled
                  ? { background: '#f5f5f5', borderColor: '#d9d9d9', color: '#8c8c8c' }
                  : { background: 'var(--color-primary-medium)', borderColor: 'var(--color-primary-medium)', color: '#fff' }
              }
            >
              Upload All ({fileList.length} files)
            </Button>
          </div>
        </div>
      }
    >
      <div style={{ ['--color-primary-dark' as any]: '#052e16', ['--color-primary' as any]: '#065f46', ['--color-primary-medium' as any]: '#2f6c2b', ['--color-primary-light' as any]: '#4d7c0f' } as React.CSSProperties}>
      <div style={{ marginBottom: 16 }}>
      
        {/* <Text type="secondary">
          Upload multiple resume files at once. Supported format: PDF
        </Text> */}
        {isFreePlan && !checkingPlan && (
          <div style={{ marginTop: 12 }}>
            <Alert
              message={<span style={{ color: '#fff', fontWeight: 700 }}>Multiple Upload Not Available</span>}
              description={
                <div style={{ color: '#fff' }}>
                  Your current plan is Free. Please upgrade your subscription to use batch resume upload.
                  <div style={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button className="company-btn" onClick={() => navigate('/subscriptions')}>Upgrade plan</Button>
                  </div>
                </div>
              }
              type="info"
              showIcon
              icon={<InfoCircleOutlined style={{ color: 'white', fontSize: 24 }} />}
              style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', border: 'none', color: '#fff' }}
            />
          </div>
        )}
      </div>
      </div>

      <Dragger
        {...uploadProps}
        style={{
          marginBottom: 12,
          borderColor: 'var(--color-primary-medium)',
          height: 120,
          maxHeight: 140,
          padding: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: 'background 160ms ease, border-color 160ms ease',
        }}
        disabled={isFreePlan}
      >
        <div style={{ textAlign: 'center', width: '100%' }} onDragOver={(e) => e.preventDefault()}>
          <div style={{ marginBottom: 6 }}>
            <InboxOutlined style={{ color: 'var(--color-primary-medium)', fontSize: 22 }} />
          </div>
          <div style={{ marginBottom: 2, fontSize: 13 }}>Click or drag files to upload</div>
          <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>Only PDF files</div>
        </div>
      </Dragger>

      {fileList.length > 0 && (
        <div style={{ borderRadius: 12, padding: 12, boxShadow: '0 6px 18px rgba(16,24,40,0.06)', background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <Title level={5} style={{ margin: 0 }}>Selected Files ({fileList.length})</Title>
          </div>
          <List
            dataSource={fileList}
            itemLayout="horizontal"
            renderItem={(file, idx) => (
              <List.Item
                style={{ borderRadius: 8, padding: '10px 12px', marginBottom: 8, border: '1px solid #f0f0f0', alignItems: 'center' }}
                actions={[
                  <Button
                    key="remove"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove(file)}
                    disabled={uploading}
                    aria-label="Remove file"
                  />
                ]}
              >
                <List.Item.Meta
                  title={
                    <Tooltip title={file.name} placement="topLeft">
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', maxWidth: 420 }}>
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>{idx + 1}. {file.name}</div>
                      </div>
                    </Tooltip>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}

      {uploading && (
        <div style={{ marginTop: 16 }}>
          <Text>Uploading files...</Text>
          <Progress percent={100} status="active" showInfo={false} strokeColor="var(--color-primary-medium)" />
        </div>
      )}
    </Drawer>
  );
};

export default UploadBatchDrawer;