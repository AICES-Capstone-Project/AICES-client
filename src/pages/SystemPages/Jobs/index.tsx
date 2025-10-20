import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Form,
  Select,
  Switch,
  message,
  InputNumber,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  jobService,
  type Job,
  type CreateJobRequest,
  type UpdateJobRequest,
} from "../../../services/jobService";


const DEFAULT_PAGE_SIZE = 10;

export default function Jobs() {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [createForm] = Form.useForm<CreateJobRequest>();
  const [editForm] = Form.useForm<UpdateJobRequest>();

  const fetchData = async (page = 1, pageSize = DEFAULT_PAGE_SIZE, kw = "") => {
    setLoading(true);
    const res = await jobService.list({ page, pageSize, keyword: kw });
    if (res.status === "Success" && res.data) {
      setJobs(res.data.items);
      setTotal(res.data.total);
    } else {
      message.error(res.message || "Failed to fetch jobs");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(
      pagination.current || 1,
      pagination.pageSize || DEFAULT_PAGE_SIZE,
      keyword
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize]);

  const columns: ColumnsType<Job> = [
    { title: "ID", dataIndex: "jobId", width: 80 },
    { title: "Title", dataIndex: "title" },
    { title: "Department", dataIndex: "department", width: 160, render: (v: string | null) => v || "—" },
    { title: "Type", dataIndex: "employmentType", width: 140 },
    { title: "Location", dataIndex: "location", width: 160, render: (v: string | null) => v || "—" },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (status: Job["status"]) => {
        const color =
          status === "Open" ? "green" : status === "Draft" ? "blue" : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      width: 170,
      render: (v: string | Date) => (v ? new Date(v).toLocaleString() : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => onDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const onSearch = () => {
    fetchData(1, pagination.pageSize || DEFAULT_PAGE_SIZE, keyword);
    setPagination({ ...pagination, current: 1 });
  };

  const onReset = () => {
    setKeyword("");
    fetchData(1, pagination.pageSize || DEFAULT_PAGE_SIZE, "");
    setPagination({ ...pagination, current: 1 });
  };

  const onChangePage = (p: TablePaginationConfig) => {
    setPagination(p);
  };

  const onCreate = async () => {
    try {
      const values = await createForm.validateFields();
      const res = await jobService.create(values);
      if (res.status === "Success") {
        message.success("Job created");
        setIsCreateOpen(false);
        createForm.resetFields();
        fetchData(pagination.current || 1, pagination.pageSize || DEFAULT_PAGE_SIZE, keyword);
      } else {
        message.error(res.message || "Create failed");
      }
    } catch (err) {
      message.error("Could not create job. Please check the form inputs.");
      console.error(err);
    }
  };

  const onEdit = (job: Job) => {
    setEditingJob(job);
    editForm.setFieldsValue({
      title: job.title,
      department: job.department || undefined,
      employmentType: job.employmentType,
      location: job.location || undefined,
      salaryMin: job.salaryMin ?? undefined,
      salaryMax: job.salaryMax ?? undefined,
      status: job.status,
      isRemote: !!job.isRemote,
    });
    setIsEditOpen(true);
  };

  const onUpdate = async () => {
    if (!editingJob) return;
    try {
      const values = await editForm.validateFields();
      const res = await jobService.update(editingJob.jobId, values);
      if (res.status === "Success") {
        message.success("Job updated");
        setIsEditOpen(false);
        setEditingJob(null);
        fetchData(pagination.current || 1, pagination.pageSize || DEFAULT_PAGE_SIZE, keyword);
      } else {
        message.error(res.message || "Update failed");
      }
    } catch (err) {
      message.error("Could not update job. Please check the form inputs.");
      console.error(err);
    }
  };

  const onDelete = (job: Job) => {
    Modal.confirm({
      title: `Delete job "${job.title}"?`,
      okText: "Delete",
      okButtonProps: { danger: true },
      icon: undefined,
      onOk: async () => {
        const res = await jobService.remove(job.jobId);
        if (res.status === "Success") {
          message.success("Job deleted");
          fetchData(pagination.current || 1, pagination.pageSize || DEFAULT_PAGE_SIZE, keyword);
        } else {
          message.error(res.message || "Delete failed");
        }
      },
    });
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search by title/department/location"
          allowClear
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={onSearch}
          style={{ width: 320 }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" onClick={onSearch} icon={<SearchOutlined />}>
          Search
        </Button>
        <Button onClick={onReset} icon={<ReloadOutlined />}>
          Reset
        </Button>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateOpen(true)}>
          New Job
        </Button>
      </Space>

      <Table
        rowKey="jobId"
        loading={loading}
        dataSource={jobs}
        columns={columns}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
          showSizeChanger: true,
        }}
        onChange={onChangePage}
      />

      {/* Create */}
      <Modal
        open={isCreateOpen}
        title="Create job"
        onCancel={() => setIsCreateOpen(false)}
        onOk={onCreate}
        okText="Create"
        destroyOnClose
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="title" label="Job Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="department" label="Department">
            <Input placeholder="e.g., Engineering, Sales" />
          </Form.Item>

          <Form.Item
            name="employmentType"
            label="Employment Type"
            rules={[{ required: true }]}
            initialValue="Full-time"
          >
            <Select
              options={[
                { value: "Full-time" },
                { value: "Part-time" },
                { value: "Contract" },
                { value: "Internship" },
              ]}
            />
          </Form.Item>

          <Form.Item name="location" label="Location">
            <Input placeholder="City / Remote" />
          </Form.Item>

          <Space size="middle" style={{ width: "100%" }}>
            <Form.Item name="salaryMin" label="Min Salary">
              <InputNumber style={{ width: 150 }} min={0} step={100} />
            </Form.Item>
            <Form.Item name="salaryMax" label="Max Salary">
              <InputNumber style={{ width: 150 }} min={0} step={100} />
            </Form.Item>
          </Space>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
            initialValue="Open"
          >
            <Select options={[{ value: "Open" }, { value: "Draft" }, { value: "Closed" }]} />
          </Form.Item>

          <Form.Item name="isRemote" label="Remote available" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit */}
      <Modal
        open={isEditOpen}
        title={`Edit job: ${editingJob?.title || ""}`}
        onCancel={() => setIsEditOpen(false)}
        onOk={onUpdate}
        okText="Save"
        destroyOnClose
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="title" label="Job Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="department" label="Department">
            <Input />
          </Form.Item>

          <Form.Item name="employmentType" label="Employment Type" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "Full-time" },
                { value: "Part-time" },
                { value: "Contract" },
                { value: "Internship" },
              ]}
            />
          </Form.Item>

          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>

          <Space size="middle" style={{ width: "100%" }}>
            <Form.Item name="salaryMin" label="Min Salary">
              <InputNumber style={{ width: 150 }} min={0} step={100} />
            </Form.Item>
            <Form.Item name="salaryMax" label="Max Salary">
              <InputNumber style={{ width: 150 }} min={0} step={100} />
            </Form.Item>
          </Space>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select options={[{ value: "Open" }, { value: "Draft" }, { value: "Closed" }]} />
          </Form.Item>

          <Form.Item name="isRemote" label="Remote available" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
