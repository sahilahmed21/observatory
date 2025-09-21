import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as AlertService from '../services/alert.service';

export const getRules = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const rules = await AlertService.getRulesForProject(projectId)
    res.json(rules);
}

export const createRule = async (req: Request, res: Response) => {
    const ruleData = { ...req.body, projectId: req.params.projectId };
    const newRule = await AlertService.createRule(ruleData);
    res.status(201).json(newRule);
}

export const deleteRule = async (req: AuthRequest, res: Response) => {
    await AlertService.deleteRule(req.params.ruleId);
    res.status(204).send();
};
