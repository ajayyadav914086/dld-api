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

  getAdmin(app: Express){
    app.get('/v1/getAdmin', adminController.getAdmin)
  }

  updateAdmin(app: Express){
    app.put('/v1/updateAdmin', adminController.updateAdmin)
  }

  updateAdminEnable(app: Express){
    app.put('/v1/updateAdminEnable', adminController.updateAdminEnable)
  }

  getDiscountValue(app: Express) {
    app.post('/v1/discount', adminController.getDiscountValue)
  }

  adminRoute(app: Express) {
    this.createAdmin(app);
    this.adminLogin(app);
    this.getAdmin(app);
    this.updateAdmin(app);
    this.updateAdminEnable(app);
    this.getDiscountValue(app);
  }
}
