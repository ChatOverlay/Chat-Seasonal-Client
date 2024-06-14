import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import Comment from "../question/Comment";
import CommentAdd from "../question/CommentAdd";
import CloseIcon from "@mui/icons-material/Close";
import "../navbarlist/ListBox.css";

export default function CommentModal({
  question,
  theme,
  setCommentToggle,
  commentToggle,
  setChangeData,
  setLoading,
}) {
  const [isVisible, setIsVisible] = useState(commentToggle);
 const commentsContainerRef = useRef(null);

  useEffect(() => {
    if (commentToggle) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Duration of slideDown animation
      return () => clearTimeout(timer);
    }
  }, [commentToggle]);

  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTop =
        commentsContainerRef.current.scrollHeight;
    }
  }, [question.comments.length]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setCommentToggle(false);
    }
  };

  return (
    <ModalOverlay
      onClick={handleOverlayClick}
      isVisible={commentToggle || isVisible}
    >
      <ModalContainer isVisible={commentToggle}>
        <CloseButton onClick={() => setCommentToggle(false)}>
          <CloseIcon />
        </CloseButton>
        <CommentsContainer
          className="scrollable-list-items"
          ref={commentsContainerRef}
        >
          {question?.comments?.length > 0 ? (
            question.comments.map((comment) => (
              <Comment
                key={comment._id}
                questionData={question}
                setChangeData={setChangeData}
                comment={comment}
                theme={theme}
              />
            ))
          ) : (
            <NoCommentsMessage>
              아직 댓글이 없습니다.
              <br /> 채택 포인트를 획득해보세요!
            </NoCommentsMessage>
          )}
        </CommentsContainer>
        <CommentAdd
          questionData={question}
          setChangeData={setChangeData}
          theme={theme}
          setLoading={setLoading}
        />
      </ModalContainer>
    </ModalOverlay>
  );
}

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 10000;
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  transition: visibility 0.3s ease-out;
`;

const ModalContainer = styled.div`
  background: var(--background-color);
  width: 100%;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  animation: ${(props) => (props.isVisible ? slideUp : slideDown)} 0.3s ease-out;
`;

const CommentsContainer = styled.div`
  flex: 1;
  max-height: 50vh;
`;

const CloseButton = styled.div`
  align-self: flex-end;
  cursor: pointer;
  margin-bottom: 0.5rem;
`;
const NoCommentsMessage = styled.div`
  text-align: center;
  margin: 1rem;
  color: var(--primary-color);
`;
