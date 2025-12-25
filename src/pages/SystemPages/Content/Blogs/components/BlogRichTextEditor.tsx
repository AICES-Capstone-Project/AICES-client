import { useEffect } from "react";
import { Button, Space, Tooltip, Modal, Input } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  LinkOutlined,
  PictureOutlined,
  CodeOutlined,
  TableOutlined,
  FontSizeOutlined,
} from "@ant-design/icons";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

type Props = {
  value?: string;
  onChange?: (html: string) => void;
};

const btnActive = (active: boolean): React.CSSProperties =>
  active
    ? { borderColor: "var(--aices-green)", color: "var(--aices-green)" }
    : {};

export default function BlogRichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class: "aices-rte-content",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Sync editor when opening modal edit (or resetting)
  useEffect(() => {
    if (!editor) return;
    const incoming = value || "<p></p>";
    // chỉ setContent khi khác thật sự để tránh cursor jump
    if (editor.getHTML() !== incoming) {
      editor.commands.setContent(incoming);
    }
  }, [value, editor]);

  const askLink = () => {
    if (!editor) return;

    const prev =
      (editor.getAttributes("link").href as string | undefined) || "";
    let temp = prev;

    Modal.confirm({
      title: "Insert link",
      content: (
        <Input
          autoFocus
          defaultValue={prev}
          placeholder="https://..."
          onChange={(e) => (temp = e.target.value)}
        />
      ),
      okText: "Apply",
      cancelText: "Cancel",
      onOk: () => {
        const href = (temp || "").trim();

        if (!href) {
          editor.chain().focus().unsetLink().run();
          return;
        }

        editor
          .chain()
          .focus()
          .setLink({
            href,
            target: "_blank",
            rel: "noopener noreferrer",
          })
          .run();
      },
    });
  };

  const askImageUrl = () => {
    if (!editor) return;

    let temp = "";

    Modal.confirm({
      title: "Insert image (URL)",
      content: (
        <Input
          autoFocus
          placeholder="https://image-url..."
          onChange={(e) => (temp = e.target.value)}
        />
      ),
      okText: "Insert",
      cancelText: "Cancel",
      onOk: () => {
        const src = (temp || "").trim();
        if (!src) return;

        editor.chain().focus().setImage({ src }).run();
      },
    });
  };

  return (
    <div className="aices-rte">
      <div className="aices-rte-toolbar">
        <Space size={8} wrap>
          <Tooltip title="Heading (H2)">
            <Button
              icon={<FontSizeOutlined />}
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
              disabled={!editor}
              className="aices-rte-btn"
              style={btnActive(!!editor?.isActive("heading", { level: 2 }))}
            />
          </Tooltip>

          <Tooltip title="Bold">
            <Button
              icon={<BoldOutlined />}
              onClick={() => editor?.chain().focus().toggleBold().run()}
              disabled={!editor}
              className="aices-rte-btn"
              style={btnActive(!!editor?.isActive("bold"))}
            />
          </Tooltip>

          <Tooltip title="Italic">
            <Button
              icon={<ItalicOutlined />}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              disabled={!editor}
              className="aices-rte-btn"
              style={btnActive(!!editor?.isActive("italic"))}
            />
          </Tooltip>

          <Tooltip title="Underline">
            <Button
              icon={<UnderlineOutlined />}
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              disabled={!editor}
              className="aices-rte-btn"
              style={btnActive(!!editor?.isActive("underline"))}
            />
          </Tooltip>

          <Tooltip title="Link">
            <Button
              icon={<LinkOutlined />}
              onClick={askLink}
              disabled={!editor}
              className="aices-rte-btn"
              style={btnActive(!!editor?.isActive("link"))}
            />
          </Tooltip>

          <Tooltip title="Image (URL)">
            <Button
              icon={<PictureOutlined />}
              onClick={askImageUrl}
              disabled={!editor}
              className="aices-rte-btn"
            />
          </Tooltip>

          <Tooltip title="Code block">
            <Button
              icon={<CodeOutlined />}
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              disabled={!editor}
              className="aices-rte-btn"
              style={btnActive(!!editor?.isActive("codeBlock"))}
            />
          </Tooltip>

          <Tooltip title="Insert table 3x3">
            <Button
              icon={<TableOutlined />}
              onClick={() =>
                editor
                  ?.chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
              disabled={!editor}
              className="aices-rte-btn"
            />
          </Tooltip>
        </Space>
      </div>

      <div className="aices-rte-editor">
        <EditorContent editor={editor} />
      </div>

      <div className="aices-rte-hint">
        Tip: Insert images using a public URL (no upload endpoint available).
      </div>
    </div>
  );
}
