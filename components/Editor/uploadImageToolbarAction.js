import React, { createRef } from 'react';
import styled from '@emotion/styled';
import { useEditor } from 'slate-react';
import { insertImage } from '@udecode/slate-plugins';
import { saveImage } from './saveImage';

const ToolbarUploadImageContainer = styled.div``;

const FileUpload = styled.input`
  display: none;
`;

const ToolbarButton = styled.span`
  background: none;
  border: 0;
  padding-left: 0;
  padding-right: 0;

  > svg {
    display: block;
    width: 20px;
    height: 20px;
  }

  :hover > svg {
    color: rgb(0, 102, 204);
  }
`;

export const ToolbarUploadImage = ({ icon }) => {
  const editor = useEditor();
  const uploadRef = createRef();

  const onClickHandler = async event => {
    event.preventDefault();
    uploadRef.current.click();
  };

  const onChangeHandler = event => {
    const uploadedFile = event.target.files[0];
    console.log(uploadedFile);
    saveImage(uploadedFile).then(
      function (result) {
        console.log(result);
        insertImage(editor, result, { uploadedFile });
      },
      function () {}
    );
  };

  return (
    <ToolbarUploadImageContainer>
      <FileUpload type="file" ref={uploadRef} onChange={onChangeHandler} />
      <ToolbarButton id="OpenImgUpload" onClick={onClickHandler}>
        {icon}
      </ToolbarButton>
    </ToolbarUploadImageContainer>
    // <ToolbarButton
    //   onMouseDown={async event => {
    //     event.preventDefault();
    //     // let url;
    //     // if (img?.rootProps?.getImageUrl != null) {
    //     //   url = await img.rootProps.getImageUrl();
    //     // } else {
    //     //   url = window.prompt('Enter the URL of the image:');
    //     // }
    //     // if (!url) return;
    //     // insertImage(editor, url, { img });
    //   }}
    // >
    //   {icon}
    //   {/* <input type="file" id="imgupload" style="display:none" /> */}
    // </ToolbarButton>
  );
};
