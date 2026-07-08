import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { resetLoginAttempts } from "../middleware/rateLimit.middleware";

const REFRESH_COOKIE = "refreshToken";

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "strict",
    path: "/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE, { path: "/auth/refresh" });
}

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Call authService.register(req.body)
    // _____________________

    // TODO: Set refresh token in httpOnly cookie via setRefreshCookie
    // _____________________

    // TODO: Return 201 JSON { user, accessToken } — NO refresh token in body!
    // _____________________
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Call authService.login(req.body)
    // _____________________

    // TODO: resetLoginAttempts(req) on success
    // _____________________

    // TODO: setRefreshCookie + return 200 { user, accessToken }
    // _____________________
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Read refresh token from req.cookies.refreshToken
    // If missing → throw UnauthorizedError or return 401
    // _____________________

    // TODO: Call authService.refresh(token), set new cookie, return { accessToken }
    // _____________________
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Read cookie, call authService.logout, clearRefreshCookie
    // Return 204 no content
    // _____________________
  }),

  getMe: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Call authService.getMe(req.user!.id), return 200 { user }
    // _____________________
  }),

  getAllUsers: asyncHandler(async (req: Request, res: Response) => {
    // TODO: Call authService.getAllUsers(), return 200 { data: users, total }
    // _____________________
  }),
};
