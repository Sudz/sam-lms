import { Request, Response } from 'express';
import { auth } from '../config/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/authMiddleware';

const resolveApiError = (error: unknown, fallbackMessage: string) => {
  if (error && typeof error === 'object') {
    const errObject = error as { status?: number; message?: string; body?: { message?: string } };
    const status = errObject.status ?? 400;
    const message = errObject.message ?? errObject.body?.message ?? fallbackMessage;
    return { status, message };
  }

  if (error instanceof Error) {
    return {
      status: 400,
      message: error.message ?? fallbackMessage,
    };
  }

  return {
    status: 400,
    message: fallbackMessage,
  };
};

export const getAuthConfiguration = asyncHandler(async (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      emailPassword: true,
      emailVerificationRequired: true,
      providers: {
        google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
      },
    },
  });
});

export const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
  const { email, redirectTo } = req.body as { email?: string; redirectTo?: string };

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
    });
  }

  try {
    const result = await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo,
      },
      headers: req.headers as Record<string, string>,
    });

    res.json({
      success: Boolean(result?.status),
      message: result?.message ?? 'If the email exists in our system, a reset link has been sent.',
    });
  } catch (error) {
    const apiError = resolveApiError(error, 'Unable to process password reset request');
    res.status(apiError.status).json({ success: false, message: apiError.message });
  }
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body as { token?: string; newPassword?: string };

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Token and new password are required',
    });
  }

  try {
    await auth.api.resetPassword({
      body: {
        token,
        newPassword,
      },
      headers: req.headers as Record<string, string>,
    });

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    const apiError = resolveApiError(error, 'Failed to reset password');
    res.status(apiError.status).json({ success: false, message: apiError.message });
  }
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword, revokeOtherSessions } = req.body as {
    currentPassword?: string;
    newPassword?: string;
    revokeOtherSessions?: boolean;
  };

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current and new passwords are required',
    });
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions,
      },
      headers: req.headers as Record<string, string>,
    });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    const apiError = resolveApiError(error, 'Unable to change password');
    res.status(apiError.status).json({ success: false, message: apiError.message });
  }
});

export const resendVerificationEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, callbackURL } = req.body as { email?: string; callbackURL?: string };

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
    });
  }

  try {
    await auth.api.sendVerificationEmail({
      body: {
        email,
        callbackURL,
      },
      headers: req.headers as Record<string, string>,
    });

    res.json({
      success: true,
      message: 'Verification email sent',
    });
  } catch (error) {
    const apiError = resolveApiError(error, 'Unable to send verification email');
    res.status(apiError.status).json({ success: false, message: apiError.message });
  }
});
