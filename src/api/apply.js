import { Router } from "express";

// import Apply from "../models/apply";

const apply = Router();

// 지원서 질문
apply.get("/", async (req, res) => {
  res.json("test");
});

// 지원서 전체보기
apply.get("/", async (req, res) => {
  res.json("test");
});

// 지원서 전체 개수
apply.get("/", async (req, res) => {
  res.json("test");
});

// 지원자 보기
apply.get("/", async (req, res) => {
  res.json("test");
});

// 임시저장
apply.put("/", async (req, res) => {
  res.json("test");
});

// 제출
apply.post("/", async (req, res) => {
  res.json("test");
});

export default apply;
