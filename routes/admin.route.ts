import {
  group,
  get,
  route,
  param,
  response,
  Doc,
  post,
  summary,
  SchemaBuilder,
  put,
  del,
} from "doctopus";
import { Express } from "express";
import { adminController } from "../controllers/admin.controller";

export default class AdminRoute {
  createAdminRole(app: Express) {
    app.post("/v1/admin-role", adminController.createAdminRoles);
  }

  adminRoute(app: Express) {
    this.createAdminRole(app);
  }
}
