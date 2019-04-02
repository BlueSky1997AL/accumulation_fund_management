import { Controller } from 'egg';
import fs from 'fs-extra';

import { MsgType, ResponseData } from '../util/interface/common';
import { FileInDB, FileInfo } from '../util/interface/file';

export default class FileController extends Controller {
    public async upload() {
        const { ctx } = this;
        const file = (ctx.request as any).files[0];

        const result = (await ctx.model.File.create({
            filename: file.filename,
            encoding: file.encoding,
            mime: file.mime,
            content: fs.readFileSync(file.filepath)
        })) as FileInDB;

        const respData: FileInfo = {
            id: result._id,
            filename: result.filename,
            mime: result.mime,
            encoding: result.encoding
        };
        ctx.body = respData;
    }

    public async getFileContent() {
        const { ctx } = this;
        const { fileID } = ctx.params;

        const response: ResponseData<null> = {
            message: MsgType.UNKNOWN_ERR,
            data: null
        };

        let fileInfo: FileInDB | null = null;
        try {
            fileInfo = (await ctx.model.File.findOne({ _id: fileID })) as FileInDB;
        } catch (error) {
            console.error((error as Error).message);
        }

        if (fileInfo) {
            ctx.response.type = fileInfo.mime;
            ctx.attachment(fileInfo.filename);
            ctx.body = fileInfo.content;
        } else {
            response.message = MsgType.FILE_NOT_FOUND;
            ctx.status = 404;
            ctx.body = response;
        }
    }
}
