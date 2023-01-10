import { Space, Timeline } from "antd";
import { Avatar } from "../../../../../core/components/Avatar";
import { ConditionalWrapper } from "../../../../../core/components/ConditionLayout";
import { CommentItem } from "./CommentItem";
import { useSelector } from "react-redux";
import { StoreState } from "../../../../../types/store";
import { DataNotFound } from "../../../../../core/components/DataNotFound";

export const CommentsBox = () => {
  const { incident, comments, hasCommentsFetched } = useSelector(
    (state: StoreState) => state.incident
  );
  return (
    <>
      <Space id="messagesBox" className="messagesBox" direction="vertical">
        <ConditionalWrapper
          className="my-12"
          isLoading={!hasCommentsFetched}
          isEmpty={comments?.length === 0 && hasCommentsFetched}
          emptyView={<DataNotFound label="No comments yet" />}
        >
          <Timeline className="h-full">
            {comments?.map((comment, index) => (
              <Timeline.Item
                className="pb-0 mb-5"
                key={index}
                dot={
                  <Avatar
                    size="default"
                    shape="circle"
                    name={comment.sender.name}
                    url={comment.sender?.gravatar}
                  />
                }
              >
                <CommentItem comment={comment} incidentId={incident.id} />
              </Timeline.Item>
            ))}
          </Timeline>
        </ConditionalWrapper>
      </Space>
      <style>{`
        .messagesBox {
          overflow-y: hidden !important;
          padding: 10px;
          row-gap: 2px !important;
          overflow: auto;
          display: flex;
          flex-direction: column-reverse;
          width: "100%";
        }
      `}</style>
    </>
  );
};
