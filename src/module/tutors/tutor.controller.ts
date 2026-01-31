import { Request, Response } from "express";
import { tutorServices } from "./tutor.services";

const createTutorProfile= async(req: Request, res: Response)=> {
    try {
        const id = req.user?.id

        if (!id) {
            return res.status(400).json({
                message: 'User ID is required'
            })
        }
        
        const result = await tutorServices.createTutorProfile(id)
        res.status(200).json({
            message: 'Tutor profile created successfully',
            result
        })
    } catch (error) {
        res.status(400).json({
            message: 'Comment creation failed',
            error: error instanceof Error ? error.message : String(error)
        });
    }

}


export  const tutorController = {
    createTutorProfile
}