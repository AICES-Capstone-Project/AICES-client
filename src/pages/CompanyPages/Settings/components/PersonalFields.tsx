import { Form, Input, DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export default function PersonalFields() {
  // const prefixSelector = (
  //   <div className="flex items-center gap-2 px-2">
  //     <img
  //       src="https://flagcdn.com/24x18/vn.png"
  //       alt="Vietnam flag"
  //       className="w-5 h-[18px] object-cover"
  //     />
  //     <span className="text-gray-700 font-medium whitespace-nowrap">+84</span>
  //   </div>
  // );

  return (
    <>
      {/* Username */}
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
        <Input size="large" placeholder="Enter full name" />
      </Form.Item>

      {/* Email */}
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


      {/* Phone + Birthday */}
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
          rules={[
            { required: true, message: "Please select your birthday" },
            {
              validator: (_, value: Dayjs) => {
                if (!value) return Promise.resolve();
                if (value.isAfter(dayjs())) {
                  return Promise.reject(new Error("Birthday cannot be in the future"));
                }
                const age = dayjs().diff(value, "year");
                if (age < 18) {
                  return Promise.reject(new Error("You must be at least 18 years old"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker
            size="large"
            format="DD/MM/YYYY"
            className="w-full"
            placeholder="Select your birthday"
            popupClassName="max-h-[300px]"
            disabledDate={(current) =>
              current &&
              (current > dayjs().endOf("day") ||
                current.isAfter(dayjs().subtract(18, "year")))}
          />
        </Form.Item>
      </div>

      {/* Address */}
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
        <Input.TextArea rows={3} placeholder="Enter your address" />
      </Form.Item>
    </>
  );
}
