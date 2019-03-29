// This file is created by egg-ts-helper@1.24.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportUser from '../../../app/controller/user';
import ExportWorkOrder from '../../../app/controller/workOrder';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    user: ExportUser;
    workOrder: ExportWorkOrder;
  }
}
