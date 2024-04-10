import Mock from "mockjs";
import banners from "@/mock/banners";
import floors from "@/mock/floors";
// mock数据，第一个参数请求地址   第二个参数：请求数据
Mock.mock("/mock/banners", { code: 200, data: banners });
Mock.mock("/mock/floors", { code: 200, data: floors });
