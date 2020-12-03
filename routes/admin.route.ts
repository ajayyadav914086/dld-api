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
  createAdmin(app: Express) {
    app.post("/v1/admin", adminController.createAdmin);
  }

  adminLogin(app: Express) {
    app.post('/v1/admin-login', adminController.adminLogin)
  }

  adminRoute(app: Express) {
    this.createAdmin(app);
    this.adminLogin(app);
  }
}
