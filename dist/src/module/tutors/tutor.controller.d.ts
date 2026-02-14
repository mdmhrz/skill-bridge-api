import { Request, Response } from "express";
export declare const tutorController: {
    createTutorProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getAllTutor: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getTutorById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateTutorProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteTutorProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getTutorOwnProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=tutor.controller.d.ts.map