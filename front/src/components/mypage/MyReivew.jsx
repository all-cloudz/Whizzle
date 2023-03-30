import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { reviewApi } from "../../apis/mypage";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/userStore";

import MyReviewItem from "./MyReviewItem";

const SBox = styled.div`
  border: 1px solid black;
`;

const SContainer = styled.div`
  width: 304px;
  height: 387px;

  background: #ffffff;
  border: 1px solid #d8d8d8;
  border-radius: 16px;
  margin-bottom: 30px;

  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const SListDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 40px;
  margin-bottom: 100px;
`;

const SWarning = styled.div`
  width: 1000px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 18px;
`;

const MyReivew = () => {
  const user = useRecoilValue(userState);
  const id = user.id;
  const [reviews, setReviews] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          myReviewApi();
        }
      },
      {
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [observerRef, lastId]);

  const myReviewApi = async () => {
    if (!isLoading) {
      setIsLoading(true);
      console.log(lastId);
      const params = {
        baseId: lastId,
        reviewOrder: "RECENT",
      };

      const myReviews = await reviewApi(id, params);
      setLastId(myReviews[myReviews.length - 1].reviewId);
      console.log(myReviews);
      setReviews((prev) => {
        return [...prev, ...myReviews];
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <SListDiv>
        {reviews.length > 0 ? (
          reviews.map((review, index) => {
            return <MyReviewItem key={index} review={review} />;
          })
        ) : (
          <SWarning>
            <span>현재 작성한 리뷰가 없습니다</span>
            <span>좋아하는 위스키에 대한 리뷰를 작성해보세요!</span>
          </SWarning>
        )}
        <div ref={observerRef}></div>
      </SListDiv>
    </>
  );
};

export default MyReivew;
