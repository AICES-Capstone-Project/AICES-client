import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input, Result, message } from "antd";
import "antd/dist/reset.css";
import FormError from "../../../../../components/FormError/FormError";

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useMemo(
    () => new URLSearchParams(location.search).get("token") ?? "",
    [location.search]
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState("");
  const [pwError, setPwError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let ok = true;
    setFormError(""); 
    setPwError(""); 
    setConfirmError("");

    if (!token) {
      setFormError("Invalid or missing link. Please request a new reset email.");
      return false;
    }
    if (!newPassword || newPassword.length < 8) {
      setPwError("Password must be at least 8 characters.");
      ok = false;
    }
    if (!confirm || confirm !== newPassword) {
      setConfirmError("Passwords do not match.");
      ok = false;
    }
    if (!ok) setFormError("Please fix the errors below.");
    return ok;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      // TODO: call your API here (ví dụ)
      // await api.resetPassword({ token, newPassword });

      // Giả lập API thành công
      await new Promise((r) => setTimeout(r, 600));

      setDone(true);
      message.success("Reset mật khẩu thành công! Đang chuyển về trang đăng nhập...");
      // Tự điều hướng về trang login sau 1.5s
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setFormError(
        err?.message || "Something went wrong. Please try again later."
      );
      message.error("Reset mật khẩu thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col gap-8">
        <Result
          status="success"
          title="Password updated"
          subTitle="Your password has been reset successfully. You can now log in with your new password."
          extra={
            <Button
              size="large"
              onClick={() => navigate("/login")}
              className="!bg-green-600 !border-green-600 !text-white !font-semibold hover:!bg-green-700 hover:!border-green-700"
            >
              Go to log in
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="text-gray-900 font-inter text-[32px] font-medium">
          Create new password
        </div>
        <div className="text-gray-600 font-inter text-base">
          Enter your new password below.
        </div>
      </div>

      {formError && <FormError type="error">{formError}</FormError>}

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <Input.Password
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            status={pwError ? "error" : undefined}
            className="!px-3 !py-2 !w-[536px]"
            onPressEnter={handleSubmit}
          />
          {pwError && <div className="text-red-500 text-sm">{pwError}</div>}
        </div>

        <div className="flex flex-col gap-1">
          <Input.Password
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            status={confirmError ? "error" : undefined}
            className="!px-3 !py-2 !w-[536px]"
            onPressEnter={handleSubmit}
          />
          {confirmError && <div className="text-red-500 text-sm">{confirmError}</div>}
        </div>
      </div>

      <Button
        type="primary"
        size="large"
        onClick={handleSubmit}
        block
        loading={loading}
        disabled={loading}
        className="!bg-green-600 !border-green-600 !text-white !font-semibold hover:!bg-green-700 hover:!border-green-700"
      >
        Reset password
      </Button>
    </div>
  );
};

export default ResetPasswordForm;
