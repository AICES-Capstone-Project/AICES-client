import { useEffect, useState } from "react";
import { Tabs, Form, Input, Button, message, Card, Spin } from "antd";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { fetchUser } from "../../../stores/slices/authSlice";
import { profileService } from "../../../services/profileService";
import { toastError, toastSuccess } from "../../../components/UI/Toast";
import PersonalFields from "./components/PersonalFields";
import AvatarUploader from "./components/AvatarUploader";
import SaveActions from "./components/SaveActions";

const { TabPane } = Tabs;

export default function Setting() {
  const [formProfile] = Form.useForm();
  const [formPassword] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  const dispatch = useAppDispatch();
  const { user, loading: userLoading } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!user) dispatch(fetchUser());
  }, [dispatch, user]);

  useEffect(() => {
    if (!user) return;

    formProfile.setFieldsValue({
      username: user.fullName || "",
      email: user.email || "",
      birthday: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
      address: user.address || "",
      phoneNumber: user.phoneNumber || "",
      prefix: "+84",
    });
  }, [user, formProfile]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const values = await formProfile.validateFields();

      const form = new FormData();
      if (values.username?.trim()) form.append("FullName", values.username.trim());
      if (values.address?.trim()) form.append("Address", values.address.trim());
      if (values.phoneNumber?.trim()) form.append("PhoneNumber", values.phoneNumber.trim());
      if (values.birthday) form.append("DateOfBirth", values.birthday.format("YYYY-MM-DD"));

      const avatarField = values.AvatarFile;
      if (Array.isArray(avatarField) && avatarField.length > 0) {
        const fileItem = avatarField[0];
        const fileToAppend = fileItem?.originFileObj ?? fileItem;
        if (fileToAppend) form.append("AvatarFile", fileToAppend);
      }

      const response = await profileService.updateMultipart(form);
      if (response.status === "Success") {
        toastSuccess("Update Profile Success!", response.message);
        dispatch(fetchUser());
      } else {
        toastError("Update profile failed", response.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) toastError("Update profile failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("New password and confirmation do not match!");
      return;
    }

    try {
      setLoading(true);
      message.success("Password change (demo) successful!");
      formPassword.resetFields();
    } catch {
      message.error("Password change failed!");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) return <Spin className="block mx-auto mt-10" />;
  if (!user) return <p className="text-center mt-10">Unable to load user information.</p>;

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Settings</span>
          {activeTab === "1" ? (
            <Button
              type="default"
              onClick={() => setActiveTab("2")}
              className="!bg-white !text-[var(--color-primary-dark)] !border !border-[var(--color-primary-dark)] hover:!bg-[var(--color-primary-light)] hover:!text-white"
            >
              Change Password
            </Button>
          ) : (
            <Button
              type="default"
              onClick={() => setActiveTab("1")}
              className="!bg-white !text-[var(--color-primary-dark)] !border !border-[var(--color-primary-dark)] hover:!bg-[var(--color-primary-light)] hover:!text-white"
            >
              Personal Info
            </Button>
          )}
        </div>
      }
      style={{
        maxWidth: 1200,
        margin: "12px auto",
        padding: "0 5px",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <div className="w-full">
        <Tabs activeKey={activeTab} onChange={setActiveTab} size="large" tabBarStyle={{ display: "none" }}>
          <TabPane key="1">
            <Form form={formProfile} onFinish={handleSaveProfile}>
              <div className="flex gap-6">
                {/* Avatar */}
                <div className="w-[30%] flex items-center justify-center">
                  <Form.Item
                    name="AvatarFile"
                    valuePropName="fileList"
                    getValueFromEvent={(file: File | null) => (file ? [file] : [])}
                    className="!mb-0"
                  >
                    <AvatarUploader
                      initialUrl={user.avatarUrl}
                      onFileChange={(file) =>
                        formProfile.setFieldsValue({ AvatarFile: file ? [file] : [] })
                      }
                      size={320}
                    />
                  </Form.Item>
                </div>

                {/* Thông tin cá nhân */}
                <div className="w-[70%] flex flex-col justify-center">
                  <PersonalFields />
                </div>
              </div>

              {/* Nút Save */}
              <div className="flex justify-center mt-6">
                <div className="w-full max-w-md">
                  <SaveActions saving={saving} className="w-full" />
                </div>
              </div>
            </Form>
          </TabPane>

          <TabPane key="2">
            <div
              className="flex items-center justify-center !w-full !py-10"
              style={{
                backgroundColor: "#fff",
              }}
            >

              <Form
                form={formPassword}
                layout="vertical"
                onFinish={handleChangePassword}
                className="w-full"
              >
                <Form.Item
                  name="oldPassword"
                  label="Current password"
                  rules={[{ required: true, message: "Please enter your current password!" }]}
                >
                  <Input.Password placeholder="Enter current password" />
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  label="New password"
                  rules={[{ required: true, message: "Please enter a new password!" }]}
                >
                  <Input.Password placeholder="Enter new password" />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Confirm new password"
                  rules={[{ required: true, message: "Please confirm your new password!" }]}
                >
                  <Input.Password placeholder="Re-enter new password" />
                </Form.Item>

                <Form.Item className="!mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full !bg-[var(--color-primary)] !hover:bg-[var(--color-primary-light)]"
                  >
                    Change password
                  </Button>
                </Form.Item>
              </Form>

            </div>
          </TabPane>

        </Tabs>
      </div>
    </Card>
  );
}
