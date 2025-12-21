import { Upload, Button } from "antd";
import type { UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { toastInfo } from "../../../../components/UI/Toast";

type Props = {
  initialUrl?: string | null;
  onFileChange?: (file: File | null) => void;
  size?: number;
  hoverText?: string;
};

export default function AvatarUploader({ initialUrl, onFileChange, size = 100, hoverText = "Edit avatar" }: Props) {

  const [preview, setPreview] = useState<string | undefined>(initialUrl || undefined);
  const [isLocalPreview, setIsLocalPreview] = useState(false);

  const handleChange: UploadProps["onChange"] = (info) => {
    const file = info.fileList?.[0]?.originFileObj ?? null;

    if (file) {
      const img = new Image();
      img.onload = () => {
        const { width, height } = img;
        const ratio = width / height;

        // ⚠️ Cảnh báo nhưng KHÔNG chặn upload
        if (Math.abs(ratio - 1) > 0.1) {
          toastInfo("Avatar tip", "A 1:1 ratio image looks best in the profile view.");
        }

        // ✅ Hiển thị preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
          setIsLocalPreview(true);
        };
        reader.readAsDataURL(file);

        onFileChange?.(file);
      };

      img.src = URL.createObjectURL(file);
    } else {
      setPreview(undefined);
      setIsLocalPreview(false);
      onFileChange?.(null);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    setIsLocalPreview(false);
    onFileChange?.(null);
  };

  useEffect(() => {
    if (initialUrl) {
      setPreview(initialUrl);
      setIsLocalPreview(false);
    }
  }, [initialUrl]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Upload
        maxCount={1}
        showUploadList={false}
        beforeUpload={() => false}
        onChange={handleChange}
        onRemove={handleRemove}
      >

        <div
          className="relative cursor-pointer transition-transform hover:scale-[1.03]"
          style={{
            width: size || 200,  
            height: size || 200,
            borderRadius: "10%",
            overflow: "hidden",
            position: "relative",
          }}
        >


          {preview ? (
            <img
              src={preview}
              alt="avatar"
              className={`w-full h-full border border-gray-300 ${isLocalPreview ? "object-contain bg-gray-50" : "object-cover"
                }`}
              style={{
                borderRadius: "10%",
                objectPosition: "center",
              }}
            />
          ) : (
            <div
              className="flex items-center justify-center w-full h-full bg-gray-100 border border-gray-300"
              style={{ borderRadius: "10%" }}
            >
              <Button icon={<UploadOutlined />}>Choose avatar</Button>
            </div>
          )}

          <div
            className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-medium text-base transition-opacity duration-300"
            style={{ borderRadius: "10%" }}
          >
            {hoverText}
          </div>
        </div>
      </Upload>


    </div>
  );
}
