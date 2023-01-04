import { Space, Form, Modal } from "antd";
import { FC, useState } from "react";
import { CreateApplicationProps } from "../../../types/application";
import { dispatch } from "../../../store/store";
import { REQUIRED_FIELD_ERROR } from "../../../core/utils/constants";
import { createApplication } from "../../../features/app/state/application/actions";
import { Input } from "core/ui-components/Input/Input";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  isAdmin?: boolean;
}
export const CreateApplicationModal: FC<Props> = ({ isOpen, onCancel, isAdmin }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const submit = () => form.submit();

  const onFinish = (form: CreateApplicationProps) => {
    setLoading(true);
    dispatch(createApplication(form, isAdmin));
    setLoading(false);
    onClose();
  };

  const onClose = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <>
      <Modal
        title="New application"
        open={isOpen}
        onCancel={onClose}
        onOk={submit}
        closable={false}
        confirmLoading={loading}
      >
        <Space direction="vertical" className="pt-0 px-4 w-full text-center">
          <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: REQUIRED_FIELD_ERROR }]}
            >
              <Input required={true} placeholder="Test" label="Name" />
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </>
  );
};
