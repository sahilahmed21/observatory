import { Request, Response } from "express";
import * as AuthService from "../services/auth.service.js";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await AuthService.registerUser(email, password);
        res.status(201).json({ user });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await AuthService.loginUser(email, password);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
