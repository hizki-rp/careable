import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

export interface TokenPayload {
  userId: string;
  username: string;
  role: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: string;
  fullName: string;
  createdAt: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyToken(token: string): TokenPayload | null {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function getUserFromToken(token: string): Promise<Omit<User, 'password'> | null> {
  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  try {
    const usersPath = path.join(process.cwd(), 'data', 'users.json');

    // Ensure directory exists
    const dataDir = path.dirname(usersPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(usersPath)) {
      return null;
    }

    const usersData = fs.readFileSync(usersPath, 'utf-8');
    const users: User[] = JSON.parse(usersData);

    const user = users.find(u => u.id === payload.userId);
    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error reading users file:', error);
    return null;
  }
}

export function readUsersFile(): User[] {
  try {
    const usersPath = path.join(process.cwd(), 'data', 'users.json');

    // Ensure directory exists
    const dataDir = path.dirname(usersPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(usersPath)) {
      throw new Error('Users file not found');
    }

    const usersData = fs.readFileSync(usersPath, 'utf-8');
    return JSON.parse(usersData) as User[];
  } catch (error) {
    console.error('Error reading users file:', error);
    throw error;
  }
}
