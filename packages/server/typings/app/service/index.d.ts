// This file is created by egg-ts-helper@1.24.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportUser from '../../../app/service/user';
import ExportWorkOrder from '../../../app/service/workOrder';

declare module 'egg' {
  interface IService {
    user: ExportUser;
    workOrder: ExportWorkOrder;
  }
}
