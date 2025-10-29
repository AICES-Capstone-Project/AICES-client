import { Form, Checkbox, Typography } from "antd";

const { Text } = Typography;

type Props = {
  optNews: boolean;
  optSummary: boolean;
  showDayMonth: boolean;
  showYear: boolean;
  setOptNews: (v: boolean) => void;
  setOptSummary: (v: boolean) => void;
  setShowDayMonth: (v: boolean) => void;
  setShowYear: (v: boolean) => void;
};

export default function Preferences({ optNews, optSummary, showDayMonth, showYear, setOptNews, setOptSummary, setShowDayMonth, setShowYear }: Props) {
  return (
    <Form.Item label="Mail preferences:">
      <div className="space-y-2">
        <Checkbox checked={optNews} onChange={(e) => setOptNews(e.target.checked)} disabled>Product news & updates</Checkbox>
        <div>
          <Checkbox checked={optSummary} onChange={(e) => setOptSummary(e.target.checked)} disabled>Receive activity summary email</Checkbox>
          <Text type="secondary" className="block">(Coming soon)</Text>
        </div>
      </div>

      <div className="mt-4">
        <Text type="secondary">Display options</Text>
        <div className="mt-3 space-y-2">
          <Checkbox checked={showDayMonth} onChange={(e) => setShowDayMonth(e.target.checked)} disabled>Show day & month</Checkbox>
          <div>
            <Checkbox checked={showYear} onChange={(e) => setShowYear(e.target.checked)} disabled>Show year</Checkbox>
            <Text type="secondary" className="block">(Display settings coming soon)</Text>
          </div>
        </div>
      </div>
    </Form.Item>
  );
}
