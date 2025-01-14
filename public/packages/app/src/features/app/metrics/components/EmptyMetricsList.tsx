import { DataNotFound } from "../../../../core/components/DataNotFound";
import { FC } from "react";
import { Typography } from "@traceo/ui";

interface Props {
  constraints?: string;
}
export const EmptyMetricsList: FC<Props> = ({ constraints }) => {
  return (
    <>
      <DataNotFound
        label="Metrics not found"
        explanation={
          constraints && (
            <Typography>
              No results for <b>{constraints}</b>
            </Typography>
          )
        }
      />
    </>
  );
};
