import { Form, Input, DatePicker } from "antd";
import dayjs from "dayjs";

export default function PersonalFields() {
  return (
    <>
      <Form.Item
        name="fullName"
        label="Full Name:"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        hasFeedback
        rules={[
          { required: true, message: "Please enter your full name" },
          { min: 3, message: "Full name must be at least 3 characters" },
          { max: 50, message: "Full name must be at most 50 characters" },
        ]}
      >
        <Input size="large" placeholder="Enter full name" maxLength={50} showCount />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email:"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input
          size="large"
          disabled
          className="bg-gray-100 !border-none !shadow-none focus:ring-0 focus:border-none cursor-default"
        />
      </Form.Item>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <Form.Item
          name="phoneNumber"
          label="Phone number:"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          hasFeedback
          rules={[
            { required: true, message: "Please enter your phone number" },
            { pattern: /^[0-9]{10,11}$/, message: "Phone number must be 10-11 digits" },
          ]}
        >
          <Input
            size="large"
            placeholder="Enter phone number"
            maxLength={11}
            showCount
            addonBefore={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0 6px",
                  minWidth: 70,
                }}
              >
                <img
                  src="https://flagcdn.com/24x18/vn.png"
                  alt="Vietnam flag"
                  style={{ width: 20, height: 14, objectFit: "cover" }}
                />
                <span style={{ fontWeight: 500, color: "#555" }}>+84</span>
              </div>
            }
          />
        </Form.Item>

        <Form.Item
          name="birthday"
          label="Birthday:"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          hasFeedback
            getValueProps={(value: any) => ({ value: value ? dayjs(value, 'DD/MM/YYYY') : undefined })}
            normalize={(val: any) => {
              if (!val) return val;
              try {
                return dayjs(val).format('DD/MM/YYYY');
              } catch {
                return val;
              }
            }}
            rules={[
              { required: true, message: "Please enter your birthday" },
              {
                validator: (_, value: any) => {
                  if (!value) return Promise.resolve();
                  const parsed = dayjs(value, [
                    'DD/MM/YYYY',
                    'DD/MMM/YYYY',
                    'D/M/YYYY',
                    'DD-MM-YYYY',
                    'DD MMM YYYY',
                    'DD-MMM-YYYY',
                  ], true);
                  if (!parsed.isValid()) return Promise.reject(new Error("Please enter date in DD/MM/YYYY format"));
                  if (parsed.isAfter(dayjs(), 'day')) return Promise.reject(new Error("Birthday cannot be in the future"));
                  const age = dayjs().diff(parsed, 'year');
                  if (age < 18) return Promise.reject(new Error("You must be at least 18 years old"));
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker size="large" format="DD/MM/YYYY" style={{ width: '100%' }} placeholder="DD/MM/YYYY" disabledDate={(current) => current && current > dayjs().endOf('day')} popupClassName="birthday-picker-popup" />
        </Form.Item>
      </div>

      <Form.Item
        name="address"
        label="Address:"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        hasFeedback
        rules={[
          { required: true, message: "Please enter your address" },
          { min: 5, message: "Address must be at least 5 characters" },
          { max: 100, message: "Address must be at most 100 characters" },
        ]}
      >
        <Input.TextArea rows={3} placeholder="Enter your address" maxLength={100} showCount />
      </Form.Item>
    </>
  );
}
