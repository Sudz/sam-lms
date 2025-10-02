import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import pool from '../config/database';
import { asyncHandler } from '../middleware/errorHandler';

export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  const result = await pool.query(
    `SELECT up.*, u.email, u.name 
     FROM user_profiles up
     LEFT JOIN users u ON up.user_id = u.id
     WHERE up.user_id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    // Create a default profile if it doesn't exist
    await pool.query(
      `INSERT INTO user_profiles (user_id) VALUES ($1)`,
      [userId]
    );

    return res.json({
      success: true,
      data: {
        user_id: userId,
        email: req.user.email,
        name: req.user.name,
      },
    });
  }

  res.json({
    success: true,
    data: result.rows[0],
  });
});

export const updateUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { first_name, last_name, phone_number, country_code, bio, avatar_url } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'User not authenticated',
    });
  }

  const result = await pool.query(
    `INSERT INTO user_profiles (user_id, first_name, last_name, phone_number, country_code, bio, avatar_url, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id) 
     DO UPDATE SET 
       first_name = EXCLUDED.first_name,
       last_name = EXCLUDED.last_name,
       phone_number = EXCLUDED.phone_number,
       country_code = EXCLUDED.country_code,
       bio = EXCLUDED.bio,
       avatar_url = EXCLUDED.avatar_url,
       updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [userId, first_name, last_name, phone_number, country_code, bio, avatar_url]
  );

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: result.rows[0],
  });
});
