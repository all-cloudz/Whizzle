import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";
import { getReview, getMyReview } from "../../apis/whiskyDetail";
import { userState } from "../../store/userStore";
import WhiskyDetailReviewItem from "./WhiskyDetailReviewItem";
import WhiskyDetailMyReviewItem from "./WhiskyDetailMyReviewItem";
import { forwardRef } from "react";

const Wrapper = styled.div`
  margin-top: 100px;
`;

const SHeadDiv = styled.div`
  width: 990px;
  display: flex;
  justify-content: space-between;
`;

const SP = styled.p`
  font-size: 24px;
  font-weight: 600;
`;

const SSpan = styled.span`
  color: #f84f5a;
`;

const SOrderSpan = styled.span`
  cursor: pointer;
`;

//위스키 상세페이지에 띄워줄 해당 위스키의 리뷰목록
const WhiskyDetailReview = forwardRef(({ whisky }, ref) => {
  const { id } = useParams();
  const user = useRecoilValue(userState);
  const isLogin = Boolean(user.id);
  const [isLast, setIsLast] = useState(false);
  const [lastId, setLastId] = useState(0);

  // 리뷰 조회
  const [reviews, setReviews] = useState([]);

  async function getReviewInfo(id, baseId, reviewOrder) {
    let data;
    if (baseId) {
      data = {
        baseId,
        reviewOrder,
      };
    } else {
      data = {
        reviewOrder,
      };
    }
    try {
      const reviewInfo = await getReview(id, data);
      if (reviewInfo.length === 0) {
        setIsLast(true); // 마지막
      } else {
        setLastId(reviewInfo[reviewInfo.length - 1].reviewInfo.reviewId); // 마지막 아닐 경우 baseId 갱신
      }
      console.log(reviewInfo);
      setReviews((prev) => [...prev, ...reviewInfo]);
    } catch (error) {
      console.log("리뷰 정보 조회 실패");
    }
  }

  // 나의 리뷰 조회
  const [myReview, setMyReview] = useState([]);
  async function getMyReviewInfo(param) {
    try {
      const myReviewInfo = await getMyReview(param);
      setMyReview(myReviewInfo);
    } catch (error) {
      console.log("나의 리뷰 조회 실패");
    }
  }

  const [sortOrder, setSortOrder] = useState("LIKE");
  const orderChange = (e) => {
    if (e.target.innerText === "좋아요순" && sortOrder === "RECENT") {
      setSortOrder("LIKE");
    } else if (e.target.innerText === "최신순" && sortOrder === "LIKE") {
      setSortOrder("RECENT");
    }
  };

  // 다른 위스키의 정보를 조회하거나, 정렬 방식을 바꿀 시 값들을 초기화 후 새로운 요청 보내기
  useEffect(() => {
    async function resetStateAndGetData() {
      setReviews([]);
      setIsLast(false);
      setLastId(0);
      setMyReview([]);

      await Promise.all([isLogin && getMyReviewInfo(id), getReviewInfo(id, 0, sortOrder)]);
    }

    resetStateAndGetData();
  }, [id, sortOrder]);

  // 무한 스크롤
  const observerRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (lastId) {
            console.log(id, lastId, sortOrder);
            getReviewInfo(id, lastId, sortOrder);
          }
        }
      },
      {
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (observerRef.current && !isLast) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [observerRef, lastId]);

  return (
    <Wrapper ref={ref}>
      <SHeadDiv>
        <SP>
          <SSpan>{whisky?.reviewCount}</SSpan>건의 리뷰
        </SP>
        <SP style={{ fontSize: "20px" }}>
          <SOrderSpan
            onClick={orderChange}
            style={{ fontWeight: sortOrder === "LIKE" ? 700 : 400, marginRight: "24px" }}
          >
            좋아요순
          </SOrderSpan>
          <span style={{ fontWeight: "400" }}>|</span>
          <SOrderSpan
            onClick={orderChange}
            style={{ fontWeight: sortOrder === "RECENT" ? 700 : 400, marginLeft: "24px" }}
          >
            최신순
          </SOrderSpan>
        </SP>
      </SHeadDiv>
      {myReview && myReview.length
        ? myReview.map((review) => {
            return (
              <WhiskyDetailMyReviewItem
                key={review.reviewInfo.reviewId}
                whiskyId={id}
                review={review}
              />
            );
          })
        : null}
      {reviews && reviews.length
        ? reviews.map((review) => {
            return <WhiskyDetailReviewItem key={review.reviewInfo.reviewId} review={review} />;
          })
        : null}
      <div ref={observerRef}></div>
    </Wrapper>
  );
});

export default WhiskyDetailReview;
