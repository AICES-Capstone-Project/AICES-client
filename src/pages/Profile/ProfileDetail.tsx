import React, { useEffect, useState } from "react";
import {
	Card,
	Avatar,
	Button,
	DatePicker,
	Checkbox,
	Upload,
	Form,
	Input,
	Typography,
	Spin,
} from "antd";
import type { UploadProps } from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import defaultAvatar from "../../assets/images/Avatar_Default.jpg";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchUser } from "../../stores/slices/authSlice";
import { profileService } from "../../services/profileService";
import { toastError, toastSuccess } from "../../components/UI/Toast";

const { Text } = Typography;

const ProfileDetail: React.FC = () => {
	const dispatch = useAppDispatch();
	const { user, loading } = useAppSelector((s) => s.auth);

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [birthday, setBirthday] = useState<Dayjs | null>(null);
	const [address, setAddress] = useState("");
	const [phoneNumber, setPhoneNumber] = useState(""); // ✅ NEW
	const [avatarFile, setAvatarFile] = useState<File | null>(null); // ✅ NEW

	// các tùy chọn UI khác vẫn giữ nhưng KHÔNG gửi lên API vì backend chưa nhận
	const [optNews, setOptNews] = useState(true);
	const [optSummary, setOptSummary] = useState(false);
	const [showDayMonth, setShowDayMonth] = useState(true);
	const [showYear, setShowYear] = useState(false);

	const [saving, setSaving] = useState(false);

	useEffect(() => {
		if (!user) dispatch(fetchUser());
	}, [dispatch, user]);

	useEffect(() => {
		if (!user) return;
		setUsername(user.fullName || "");
		setEmail(user.email || "");
		setBirthday(user.dateOfBirth ? dayjs(user.dateOfBirth) : null); // ✅ đổi ở đây
		setAddress(user.address || "");
		setPhoneNumber(user.phoneNumber || "");
	}, [user]);

	const uploadProps: UploadProps = {
		showUploadList: true,
		maxCount: 1,
		beforeUpload: (file) => {
			setAvatarFile(file); // ✅ giữ file trong state
			return false; // ⛔ chặn antd tự upload
		},
		onRemove: () => {
			setAvatarFile(null);
		},
	};

	const handleSave = async () => {
		try {
			setSaving(true);

			const form = new FormData();
			if (username?.trim()) form.append("FullName", username.trim());
			if (address?.trim()) form.append("Address", address.trim());
			if (phoneNumber?.trim()) form.append("PhoneNumber", phoneNumber.trim());
			// backend yêu cầu $date (string). Gửi "YYYY-MM-DD" là chuẩn.
			if (birthday) form.append("DateOfBirth", birthday.format("YYYY-MM-DD"));
			if (avatarFile) form.append("AvatarFile", avatarFile); // file binary

			const response = await profileService.updateMultipart(form);
			console.log("🔄 [ProfileDetail] Server response:", response);
			if (response.status === "Success") {
				toastSuccess("Update Profile Success!", response.message);
				dispatch(fetchUser());
				setAvatarFile(null); // clear avatar đã chọn
			} else {
				toastError("Update profile failed", response.message);
			}
		} catch (err: unknown) {
			toastError(
				"Update profile failed",
				err instanceof Error ? err.message : "Something went wrong."
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <Spin className="block mx-auto mt-10" />;
	if (!user)
		return <p className="text-center mt-10">Unable to load user info.</p>;

	return (
		<div className="max-w-4xl mx-auto p-6">
			<Card
				className="shadow-md rounded-xl"
				title={<span className="text-lg font-semibold">Account details</span>}
				headStyle={{ background: "#f7f9fc" }}
			>
				<Form
					layout="horizontal"
					labelCol={{ span: 7 }}
					wrapperCol={{ span: 17 }}
					colon={false}
					style={{ maxWidth: 980 }}
					onFinish={handleSave}
				>
					{/* Username */}
					<Form.Item label="Username:">
						<div className="flex items-center gap-3">
							<Input
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Enter username"
							/>
							<Button size="small" onClick={handleSave} loading={saving}>
								Save
							</Button>
						</div>
						<Text type="secondary" className="block mt-1">
							Your username was last changed on 09/04/25 at 16:07.
						</Text>
					</Form.Item>

					{/* Email (read-only) */}
					<Form.Item label="Email:">
						<div className="flex items-center gap-3">
							<Input disabled value={email} />
							<Button size="small" disabled>
								Change
							</Button>
						</div>
					</Form.Item>

					{/* Phone number ✅ NEW */}
					<Form.Item label="Phone number:">
						<Input
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							placeholder="+84..."
						/>
					</Form.Item>

					{/* Mail preferences – UI only */}
					<Form.Item label="Mail preferences:">
						<div className="space-y-2">
							<Checkbox
								checked={optNews}
								onChange={(e) => setOptNews(e.target.checked)}
								disabled
							>
								Product news & updates
							</Checkbox>
							<div>
								<Checkbox
									checked={optSummary}
									onChange={(e) => setOptSummary(e.target.checked)}
									disabled
								>
									Receive activity summary email
								</Checkbox>
								<Text type="secondary" className="block">
									(Coming soon)
								</Text>
							</div>
						</div>
					</Form.Item>

					{/* Avatar (upload file) */}
					<Form.Item label="Avatar:">
						<div className="flex items-center gap-16">
							<Avatar
								size={88}
								src={user.avatarUrl || defaultAvatar}
								className="border border-gray-300"
							/>
							<Upload {...uploadProps}>
								<Button icon={<UploadOutlined />}>Choose avatar</Button>
							</Upload>
						</div>
					</Form.Item>

					{/* Profile banner – chưa có API → disable */}
					<Form.Item label="Profile banner:">
						<Button icon={<UploadOutlined />} disabled>
							Coming soon
						</Button>
					</Form.Item>

					{/* Birthday */}
					<Form.Item label="Birthday:">
						<div>
							<DatePicker
								value={birthday}
								onChange={(d) => setBirthday(d)}
								format="DD/MM/YY"
								className="w-full md:w-1/3"
							/>
							<Text type="secondary" className="block mt-2">
								Once saved, your birthday can&apos;t be changed. Contact support
								if needed.
							</Text>
							<div className="mt-3 space-y-2">
								<Checkbox
									checked={showDayMonth}
									onChange={(e) => setShowDayMonth(e.target.checked)}
									disabled
								>
									Show day & month
								</Checkbox>
								<div>
									<Checkbox
										checked={showYear}
										onChange={(e) => setShowYear(e.target.checked)}
										disabled
									>
										Show year
									</Checkbox>
									<Text type="secondary" className="block">
										(Display settings coming soon)
									</Text>
								</div>
							</div>
						</div>
					</Form.Item>

					{/* Address */}
					<Form.Item label="Address:">
						<Input.TextArea
							rows={2}
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							placeholder="Enter your address"
						/>
					</Form.Item>

					{/* Save */}
					<Form.Item label=" " colon={false}>
						<div className="flex justify-center">
							<Button
								type="primary"
								icon={<SaveOutlined />}
								size="large"
								htmlType="submit"
								loading={saving}
							>
								Save changes
							</Button>
						</div>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default ProfileDetail;
