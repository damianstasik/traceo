import { Button, Input, Typography } from "antd";
import { ColumnSection } from "../../../../core/components/ColumnSection";
import { Confirm } from "../../../../core/components/Confirm";
import { PagePanel } from "../../../../core/components/PagePanel";
import api from "../../../../core/lib/api";
import dateUtils from "../../../../core/utils/date";
import { useState } from "react";
import { useSelector } from "react-redux";
import { dispatch } from "../../../../store/store";
import { ApiResponse } from "../../../../types/api";
import { StoreState } from "../../../../types/store";
import { loadApplication } from "../../../app/state/application/actions";
import { InputSecret } from "core/ui-components/InputSecret";
import { InputGroup } from "core/ui-components/InputGroup";

export const ApiKeySection = () => {
  const { application } = useSelector((state: StoreState) => state.application);
  const [loading, setLoading] = useState<boolean>(false);

  const hasApiKey = !!application?.security?.apiKey;

  const handleGenerateApiKey = async () => {
    setLoading(true);
    await api
      .post<ApiResponse<string>>(`/api/application/api-key/generate/${application.id}`)
      .then(() => {
        dispatch(loadApplication());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemoveApiKey = async () => {
    setLoading(true);
    await api
      .delete<ApiResponse<unknown>>(`/api/application/api-key/remove/${application.id}`)
      .then(() => {
        dispatch(loadApplication());
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <PagePanel title="API Key">
        <ColumnSection
          firstColumnWidth={12}
          secondColumnWidth={12}
          subtitle="Thanks to API Key you can fully integrate this app with Traceo SDK. Remember to not store this key in your code, better way is to use him like as environment variable."
        >
          {hasApiKey ? (
            <>
              <InputGroup>
                <InputSecret
                  className="w-full"
                  readOnly={true}
                  defaultValue={application?.security?.apiKey}
                />
                <Confirm
                  withAuth={true}
                  description="Removing your API key will cause that SDK using this token lose access."
                  onOk={handleRemoveApiKey}
                >
                  <Button type="primary" danger>
                    Remove
                  </Button>
                </Confirm>
              </InputGroup>
              <Typography.Text className="text-xs">
                Last generated {dateUtils.fromNow(application?.security?.lastUpdate)} by{" "}
                {application?.security?.generatedBy}
              </Typography.Text>
            </>
          ) : (
            <Button loading={loading} type="primary" onClick={handleGenerateApiKey}>
              Generate
            </Button>
          )}
        </ColumnSection>
      </PagePanel>
    </>
  );
};
