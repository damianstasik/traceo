import { Space, Form, Modal } from "antd";
import { useState } from "react";
import { dispatch } from "../../../store/store";
import { addServerAccount } from "../../../features/management/state/accounts/actions";
import { AddAccountProps } from "../../../types/accounts";
import validators from "../../lib/validators";
import { REQUIRED_FIELD_ERROR } from "../../../core/utils/constants";
import { Input } from "core/ui-components/Input/Input";
import { InputSecret } from "core/ui-components/Input/InputSecret";

export const NewAccountModal = ({ isOpen, onCancel }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const submit = () => form.submit();

  const onFinish = (props: AddAccountProps) => {
    setLoading(true);
    dispatch(addServerAccount(props));
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
        title="New account"
        open={isOpen}
        closable={false}
        onOk={submit}
        onCancel={onClose}
        confirmLoading={loading}
      >
        <Space
          direction="vertical"
          className="pt-0 px-4 w-full h-full justify-between text-center"
        >
          <Form onFinish={onFinish} form={form} layout="vertical">
            <Form.Item
              name="username"
              rules={[{ required: true, message: REQUIRED_FIELD_ERROR }]}
            >
              <Input label="Username *" />
            </Form.Item>
            <Form.Item name="name">
              <Input label="Name" />
            </Form.Item>
            <Form.Item name="email" rules={[{ required: false }, ...validators.email]}>
              <Input label="Email address" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: REQUIRED_FIELD_ERROR
                },
                ...validators.password
              ]}
            >
              <InputSecret label="Password *" />
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </>
  );
};
