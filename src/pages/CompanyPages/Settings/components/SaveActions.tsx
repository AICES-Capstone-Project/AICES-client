import { Form, Button } from "antd";
import { SaveOutlined } from "@ant-design/icons";

type Props = {
  saving: boolean;
  className?: string;
};

export default function SaveActions({ saving, className }: Props) {
  return (
    <Form.Item label=" " colon={false}>
      <div className="flex justify-center">
        <Button
          htmlType="submit"
          loading={saving}
          icon={<SaveOutlined />}
          size="large"
          className={`!bg-[var(--color-primary-light)] 
                     hover:!bg-[var(--color-primary)] 
                     !text-white 
                     !border-none 
                     px-8 py-6 
                     rounded-2xl 
                     shadow-md 
                     hover:shadow-lg 
                     transition-all 
                     duration-300 
                     flex items-center gap-2
                     w-full
                     ${className ?? ""}`}
        >
          Save changes
        </Button>
      </div>
    </Form.Item>
  );
}
