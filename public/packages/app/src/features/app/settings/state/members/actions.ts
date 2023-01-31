import api, { ApiQueryParams } from "../../../../../core/lib/api";
import { ThunkResult } from "@store/types";
import {
  AddAccountToApplication,
  ApplicationMember,
  ApplicationMemberUpdateProps,
  ApiResponse
} from "@traceo/types";
import { membersLoaded } from "./reducers";

export const loadMembers = (query?: ApiQueryParams): ThunkResult<void> => {
  return async (dispatch, getStore) => {
    const application = getStore().application.application;
    if (!query?.id) {
      query = {
        id: application.id
      };
    }

    const { data } = await api.get<ApiResponse<ApplicationMember[]>>("/api/amr/members", query);
    dispatch(membersLoaded(data));
  };
};

export const addMember = (props: AddAccountToApplication): ThunkResult<void> => {
  return async (dispatch) => {
    await api.post(
      "/api/amr/application/add",
      props
    );
    dispatch(loadMembers());
  };
};

export const updateMember = (update: ApplicationMemberUpdateProps): ThunkResult<void> => {
  return async (dispatch) => {
    await api.patch("/api/amr/application/member", update);
    dispatch(loadMembers());
  };
};

export const removeMember = (id: string): ThunkResult<void> => {
  return async (dispatch) => {
    await api.delete("/api/amr/application/member", { id });
    dispatch(loadMembers());
  };
};
