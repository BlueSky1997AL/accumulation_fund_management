import { UploadFile } from 'antd/lib/upload/interface';
import { FileInfo } from '~server/app/util/interface/file';

export function uploadFilesToFileInfos (uploadFiles: UploadFile[] = []) {
    return uploadFiles.map(file => file.response) as FileInfo[];
}
