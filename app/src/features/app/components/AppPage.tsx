import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { dispatch } from "../../../store/store";
import { useSelector } from "react-redux";
import { StoreState } from "../../../types/store";
import { isEmptyObject } from "../../../core/utils/object";
import NotFound from "../../../core/components/Layout/Pages/NotFound";
import { TraceoLoading } from "../../../core/components/TraceoLoading";
import { PageCenter } from "../../../core/components/PageCenter";
import { loadApplication } from "../state/application/actions";

const AppPage = ({ children }) => {
  const { id } = useParams();

  const { application } = useSelector((state: StoreState) => state.application);

  useEffect(() => {
    dispatch(loadApplication(id));
  }, []);

  const hasMemberRole = application?.member?.role;

  if (isEmptyObject(application)) {
    return (
      <PageCenter>
        <TraceoLoading />
      </PageCenter>
    );
  }

  if (!hasMemberRole) {
    return (
      <PageCenter>
        <NotFound />
      </PageCenter>
    );
  }

  return <div className="pb-5 pt-12">{children}</div>;
};

export default AppPage;
