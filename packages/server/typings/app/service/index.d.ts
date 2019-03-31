// This file is created by egg-ts-helper@1.24.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportWorkOrder from '../../../app/service/workOrder';

declare module 'egg' {
  interface IService {
    workOrder: ExportWorkOrder;
  }
}
