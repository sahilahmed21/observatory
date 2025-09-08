import { PrismaClient } from "../generated/prisma";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

export const registerUser = async (email: string, password: string) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        throw new Error('User with this email already exists.');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword
        },
    });
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}


export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new Error('Invalid credentials.');

    }
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-default-secret-key',
        { expiresIn: '1d' }


    )
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };



}
