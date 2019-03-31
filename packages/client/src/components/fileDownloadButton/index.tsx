import { Button, Icon } from 'antd';
import React from 'react';
import { FileInfo } from '~server/app/util/interface/file';

interface FileDownloadButtonProps {
    data: FileInfo;
    style?: React.CSSProperties
}

function FileDownloadButton ({ data, style }: FileDownloadButtonProps) {
    function handleDownload () {
        location.href = `/api/file/content/${data.id}`;
    }

    return (
        <Button style={style} type="ghost" onClick={handleDownload}>
            <Icon type="link" />
            {data.filename}
        </Button>
    );
}

export default FileDownloadButton;
