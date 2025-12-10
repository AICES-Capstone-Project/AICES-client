import React, { useState } from 'react';
import { Drawer, Form, Input, Select, DatePicker, Button, message, InputNumber } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { campaignService } from '../../../../services/campaignService';
import { jobService } from '../../../../services/jobService';
import type { CompanyJob } from '../../../../services/jobService';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  // edit mode
  initialValues?: any;
  campaignId?: number;
  onUpdated?: () => void;
};

const CampaignCreateDrawer: React.FC<Props> = ({ open, onClose, onCreated, initialValues, campaignId, onUpdated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [jobOptions, setJobOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [jobLoading, setJobLoading] = useState(false);

  // populate form when initialValues change
  React.useEffect(() => {
    if (initialValues) {
      const values = { ...initialValues };
      // convert ISO strings to dayjs for DatePicker
      if (values.startDate) values.startDate = dayjs(values.startDate);
      if (values.endDate) values.endDate = dayjs(values.endDate);
      // normalize job selection: support either `jobIds: [1,2]` or `jobs: [{jobId, targetQuantity}]`
      if (values.jobs && Array.isArray(values.jobs)) {
        // ensure jobs are shaped as { jobId: string, targetQuantity: number }
        values.jobs = values.jobs.map((j: any) => ({ jobId: String(j.jobId), targetQuantity: Number(j.targetQuantity ?? 1) }));
      } else if (values.jobIds && Array.isArray(values.jobIds)) {
        values.jobs = values.jobIds.map((j: any) => ({ jobId: String(j), targetQuantity: 1 }));
      }
      form.setFieldsValue(values);
    } else {
      form.resetFields();
    }
  }, [initialValues]);

  // Load job list for selection
  React.useEffect(() => {
    let mounted = true;
    const loadJobs = async () => {
      setJobLoading(true);
      try {
        // try to fetch many jobs in one call (pageSize large)
        const resp = await jobService.getCompanyJobs(1, 1000);
        const list: CompanyJob[] = resp?.data?.jobs || [];
        if (!mounted) return;
        const opts = (list || []).map(j => ({ label: j.title || String(j.jobId), value: String(j.jobId) }));
        setJobOptions(opts);
      } catch (err) {
        console.error('Failed to load jobs for select', err);
        setJobOptions([]);
      } finally {
        if (mounted) setJobLoading(false);
      }
    };
    loadJobs();
    return () => { mounted = false; };
  }, []);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload: any = {
        title: values.title,
        description: values.description,
        status: values.status,
      };
      if (values.startDate) payload.startDate = values.startDate.toISOString();
      if (values.endDate) payload.endDate = values.endDate.toISOString();
      // construct `jobs` array expected by backend: [{ jobId: number, targetQuantity: number }]
      if (values.jobs && Array.isArray(values.jobs) && values.jobs.length) {
        payload.jobs = values.jobs
          .map((j: any) => ({ jobId: Number(j.jobId), targetQuantity: Number(j.targetQuantity) || 1 }))
          .filter((it: any) => Number.isFinite(it.jobId) && !isNaN(it.jobId));
      } else if (values.jobIds && Array.isArray(values.jobIds) && values.jobIds.length) {
        // backward-compatible: map simple jobIds to jobs with default targetQuantity
        payload.jobs = values.jobIds
          .map((v: any) => ({ jobId: Number(v), targetQuantity: 1 }))
          .filter((it: any) => Number.isFinite(it.jobId) && !isNaN(it.jobId));
      }

      let resp: any = null;
      if (campaignId) {
        // edit mode
        resp = await campaignService.updateCampaign(campaignId, payload);
      } else {
        resp = await campaignService.createCampaign(payload);
      }
      console.log('campaign save resp', resp);
      const ok = resp?.status === 'Success' || resp?.statusCode === 200 || resp?.message;
      if (ok) {
        message.success(campaignId ? 'Campaign updated' : 'Campaign created');
        form.resetFields();
        if (campaignId) onUpdated && onUpdated();
        else onCreated && onCreated();
        onClose();
      } else {
        message.error(campaignId ? 'Failed to update campaign' : 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Create campaign error', error);
      message.error('Create campaign failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title={campaignId ? 'Edit Campaign' : 'Create Campaign'}
      open={open}
      width={520}
      onClose={() => { onClose(); form.resetFields(); }}
      destroyOnClose
    >
      <Form layout="vertical" form={form} initialValues={{ status: 'Published' }} onFinish={handleFinish}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input title' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="startDate" label="Start Date">
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="endDate" label="End Date">
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select>
            <Select.Option value="Published">Published</Select.Option>
            <Select.Option value="Private">Private</Select.Option>
            <Select.Option value="Expired">Expired</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Jobs (optional)">
          <Form.List name="jobs">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'jobId']}
                      rules={[{ required: true, message: 'Please select a job' }]}
                      style={{ flex: 1, marginBottom: 0 }}
                    >
                      <Select
                        placeholder={jobLoading ? 'Loading jobs...' : 'Select job'}
                        options={jobOptions}
                        loading={jobLoading}
                        showSearch
                        optionFilterProp="label"
                      />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'targetQuantity']}
                      initialValue={1}
                      rules={[{ required: true, message: 'Please input target quantity' }]}
                      style={{ width: 160, marginBottom: 0 }}
                    >
                      <InputNumber placeholder="Target Quantity" min={1} step={1} style={{ width: '100%' }} />
                    </Form.Item>

                    <MinusCircleOutlined
                      onClick={() => remove(field.name)}
                      style={{ color: 'red', cursor: 'pointer', fontSize: 18 }}
                    />
                  </div>
                ))}

                <Button type="dashed" onClick={() => add({ jobId: undefined, targetQuantity: "" })} icon={<PlusCircleOutlined />}>
                  Add job
                </Button>
              </>
            )}
          </Form.List>
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={() => { onClose(); form.resetFields(); }}>Cancel</Button>
          <Button type="primary" loading={loading} onClick={() => form.submit()}>{campaignId ? 'Save' : 'Create'}</Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default CampaignCreateDrawer;
