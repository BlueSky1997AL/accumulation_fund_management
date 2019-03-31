// This file is created by egg-ts-helper@1.24.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportFile from '../../../app/model/file';
import ExportUser from '../../../app/model/user';
import ExportWorkOrder from '../../../app/model/workOrder';

declare module 'egg' {
  interface IModel {
    File: ReturnType<typeof ExportFile>;
    User: ReturnType<typeof ExportUser>;
    WorkOrder: ReturnType<typeof ExportWorkOrder>;
  }
}
