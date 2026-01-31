import { Request, Response } from "express";

const getCurrentUser = async (req: Request, res: Response) => {
    const result = res.json(req.user);
}

export { getCurrentUser }