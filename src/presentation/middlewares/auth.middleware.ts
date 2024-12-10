import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";

export class AuthMiddleware {
  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorizarion = req.header("authorization");

    if (!authorizarion) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!authorizarion.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const token = authorizarion.split(" ").at(1) || "";

    try {
      const payload = await JwtAdapter.validateToken<{ id: string }>(token);

      if (!payload) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const user = await UserModel.findById(payload.id);

      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      

      req.body.user = user;

      next();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  }
}
