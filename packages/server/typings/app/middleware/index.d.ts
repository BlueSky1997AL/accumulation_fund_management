// This file is created by egg-ts-helper@1.24.1
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAuthCheck from '../../../app/middleware/authCheck';
import ExportFileAPIProtection from '../../../app/middleware/fileAPIProtection';
import ExportUserProtection from '../../../app/middleware/userProtection';

declare module 'egg' {
  interface IMiddleware {
    authCheck: typeof ExportAuthCheck;
    fileAPIProtection: typeof ExportFileAPIProtection;
    userProtection: typeof ExportUserProtection;
  }
}
