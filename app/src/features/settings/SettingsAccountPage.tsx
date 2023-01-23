import { ColumnSection } from "../../core/components/ColumnSection";
import { useAppDispatch } from "../../store";
import { DashboardSettingsNavigation } from "../../features/settings/components/DashboardSettingsNavigation";
import {
  updateAccount,
  updateAccountPassword
} from "../../features/app/settings/state/settings/actions";
import { Input } from "core/ui-components/Input";
import { InputSecret } from "core/ui-components/Input/InputSecret";
import { Button } from "core/ui-components/Button";
import { Form } from "core/ui-components/Form";
import { FormItem } from "core/ui-components/Form/FormItem";
import { ButtonContainer } from "core/ui-components/Button/ButtonContainer";
import { Card } from "core/ui-components/Card";
import { useMemberRole } from "core/hooks/useMemberRole";
import { useDemo } from "core/hooks/useDemo";
import { useAccount } from "core/hooks/useAccount";

type UpdateAccountForm = {
  name: string;
  email: string;
};

type UpdatePasswordForm = {
  password: string;
  newPassword: string;
};

const SettingsAccountPage = () => {
  const dispatch = useAppDispatch();
  const account = useAccount();
  const { isAdmin } = useMemberRole();
  const { isDemo } = useDemo();

  const onFinishUpdateAccount = (form: UpdateAccountForm) =>
    dispatch(updateAccount(form));

  const onFinishUpdatePassword = (form: UpdatePasswordForm) =>
    dispatch(updateAccountPassword(form));

  return (
    <DashboardSettingsNavigation>
      <Card title="Basic Information">
        <ColumnSection
          title="Personal information"
          subtitle="This information will appear on your profile."
        >
          <Form
            onSubmit={onFinishUpdateAccount}
            defaultValues={{
              name: account?.name,
              email: account?.email
            }}
            id="basic-info-form"
            className="w-2/3"
          >
            {({ register, errors }) => (
              <>
                <FormItem label="Name" error={errors?.name} disabled={isAdmin || isDemo}>
                  <Input
                    {...register("name", {
                      required: true
                    })}
                  />
                </FormItem>

                <FormItem
                  label="Email"
                  error={errors?.email}
                  disabled={isAdmin || isDemo}
                >
                  <Input
                    {...register("email", {
                      required: false,
                      pattern: {
                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "This email address is invalid"
                      }
                    })}
                  />
                </FormItem>
              </>
            )}
          </Form>
          {!isAdmin && (
            <ButtonContainer justify="start">
              <Button form="basic-info-form" type="submit">
                Update
              </Button>
            </ButtonContainer>
          )}
        </ColumnSection>
      </Card>

      <Card title="Security">
        <ColumnSection
          title="Update password"
          subtitle="After a successful password update, you will be redirected to the login page where you can log in with your new password."
        >
          <Form
            onSubmit={onFinishUpdatePassword}
            id="update-password-form"
            className="w-2/3"
          >
            {({ register, errors }) => (
              <>
                <FormItem label="Password" error={errors.password}>
                  <InputSecret
                    {...register("password", {
                      required: true
                    })}
                  />
                </FormItem>

                <FormItem label="New password" error={errors.newPassword}>
                  <InputSecret
                    {...register("newPassword", {
                      required: true,
                      pattern: {
                        value: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                        message: "This password is too weak"
                      }
                    })}
                  />
                </FormItem>
              </>
            )}
          </Form>
          <ButtonContainer justify="start">
            <Button type="submit" form="update-password-form">
              Confirm
            </Button>
          </ButtonContainer>
        </ColumnSection>
      </Card>
    </DashboardSettingsNavigation>
  );
};

export default SettingsAccountPage;
