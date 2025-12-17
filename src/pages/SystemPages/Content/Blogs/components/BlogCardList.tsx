import {
  Card,
  Col,
  Empty,
  Image,
  Popconfirm,
  Row,
  Space,
  Typography,
  Button,
  Pagination,
} from "antd";

import type { TablePaginationConfig } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import type { Blog } from "../../../../../types/blog.types";

const { Text, Title, Paragraph } = Typography;

interface BlogCardListProps {
  loading: boolean;
  data: Blog[];
  pagination: TablePaginationConfig;
  onChangePage: (pagination: TablePaginationConfig) => void;
  onEdit: (blog: Blog) => void;
  onDelete: (id: number) => void;
}

export default function BlogCardList({
  loading,
  data,
  pagination,
  onChangePage,
  onEdit,
  onDelete,
}: BlogCardListProps) {
  return (
    <div className="blog-card-grid">
      {(!data || data.length === 0) && !loading ? (
        <Empty description="No blogs found" />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {data.map((blog) => (
              <Col key={blog.blogId} xs={24} sm={12} lg={8} xl={6}>
                <Card
                  className="aices-blog-card"
                  loading={loading}
                  hoverable
                  cover={
                    <div className="aices-blog-card-cover">
                      {blog.thumbnailUrl ? (
                        <Image
                          src={blog.thumbnailUrl}
                          alt={blog.title}
                          preview={false}
                          className="aices-blog-card-img"
                        />
                      ) : (
                        <div className="aices-blog-card-img aices-blog-card-img--empty">
                          <Text type="secondary">No thumbnail</Text>
                        </div>
                      )}
                    </div>
                  }
                  actions={[
                    <Space key="actions" size="small">
                      <Button
                        type="default"
                        shape="circle"
                        size="small"
                        icon={<EditOutlined />}
                        
                        onClick={() => onEdit(blog)}
                      />
                      <Popconfirm
                        title="Delete this blog?"
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => onDelete(blog.blogId)}
                      >
                        <Button
                          danger
                          shape="circle"
                          size="small"
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>
                    </Space>,
                  ]}
                >
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <Title
                      level={5}
                      className="aices-blog-card-title"
                      title={blog.title}
                    >
                      {blog.title}
                    </Title>

                    <Paragraph
                      className="aices-blog-card-snippet"
                      ellipsis={{ rows: 2 }}
                    >
                      {blog.content || "—"}
                    </Paragraph>

                    <Space size={6} wrap>
                      <Text type="secondary">
                        {blog.createdAt
                          ? dayjs(blog.createdAt).format("DD/MM/YYYY HH:mm")
                          : "—"}
                      </Text>
                      <Text type="secondary">•</Text>
                      <Text type="secondary">{blog.authorName || "—"}</Text>
                    </Space>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination: reuse TablePaginationConfig nhưng render bằng Card-level pagination */}
          <div className="blog-card-pagination">
            {/* Dùng Pagination của AntD cho đẹp */}
            {/* eslint-disable-next-line @typescript-eslint/no-var-requires */}
            <div className="blog-card-pagination">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                showSizeChanger={pagination.showSizeChanger}
                pageSizeOptions={pagination.pageSizeOptions}
                onChange={(page, pageSize) =>
                  onChangePage({ ...pagination, current: page, pageSize })
                }
                onShowSizeChange={(page, pageSize) =>
                  onChangePage({ ...pagination, current: page, pageSize })
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
