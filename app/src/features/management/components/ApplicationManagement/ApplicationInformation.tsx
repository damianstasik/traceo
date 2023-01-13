import { Space } from "core/ui-components/Space/Space";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Confirm } from "../../../../core/components/Confirm";
import api from "../../../../core/lib/api";
import { dispatch } from "../../../../store/store";
import { ApiResponse } from "../../../../types/api";
import { StoreState } from "../../../../types/store";
import { updateServerApplication } from "../../state/applications/actions";
import dateUtils from "../../../../core/utils/date";
import { Button } from "core/ui-components/Button/Button";
import { Card } from "core/ui-components/Card/Card";
import { ColumnSection } from "core/components/ColumnSection";
import { FieldLabel } from "core/ui-components/Form/FieldLabel";
import { Input } from "core/ui-components/Input/Input";

export const ApplicationInformation = () => {
  const navigate = useNavigate();
  const { application } = useSelector((state: StoreState) => state.serverApplications);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const onUpdate = (name: string) => {
    dispatch(updateServerApplication(name));
  };

  const onRemove = async () => {
    setLoadingDelete(true);
    await api
      .delete<ApiResponse<unknown>>(`/api/application/${application.id}`)
      .then((resp) => {
        if (resp.status === "success") {
          navigate("/dashboard/management/apps");
        }
      })
      .finally(() => {
        setLoadingDelete(false);
      });
  };

  const OperationButtons = () => {
    return (
      <Space className="w-full justify-end">
        <Confirm
          auth={true}
          description="Are you sure that you want to remove this app?"
          onOk={() => onRemove()}
        >
          <Button variant="danger" loading={loadingDelete}>
            Remove app
          </Button>
        </Confirm>
      </Space>
    );
  };

  return (
    <>
      <Card title="Basic Information" extra={<OperationButtons />}>
        <ColumnSection subtitle="Basic information about the application. To edit his details, go to his settings on the dashboard.">
          <div className="flex flex-col w-2/3">
            <FieldLabel label="ID">
              <Input defaultValue={application?.id} disabled />
            </FieldLabel>
            <FieldLabel label="Name">
              <Input defaultValue={application?.name} disabled />
            </FieldLabel>
            <FieldLabel label="Last error at">
              <Input
                defaultValue={dateUtils.fromNow(application.lastIncidentAt)}
                disabled
              />
            </FieldLabel>
            <FieldLabel label="Incidents count">
              <Input defaultValue={application?.incidentsCount} disabled />
            </FieldLabel>
            <FieldLabel label="Errors count">
              <Input defaultValue={application?.errorsCount} disabled />
            </FieldLabel>
          </div>
        </ColumnSection>

        {/* <Descriptions>
          <DescriptionInputRow label="ID" editable={false}>
            <Typography>{application?.id}</Typography>
          </DescriptionInputRow>
          <DescriptionInputRow label="Name" editable={true} onUpdate={onUpdate}>
            {application.name}
          </DescriptionInputRow>
          <DescriptionInputRow label="Last error at">
            {dateUtils.fromNow(application.lastIncidentAt)}
          </DescriptionInputRow>
          <DescriptionInputRow label="Incidents count">
            {application.incidentsCount}
          </DescriptionInputRow>
          <DescriptionInputRow label="Errors count">
            {application.errorsCount}
          </DescriptionInputRow>
        </Descriptions> */}
      </Card>
    </>
  );
};
