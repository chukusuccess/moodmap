import React from "react";
import { Modal } from "antd";

export const info = (title, content, handleOk) => {
  Modal.info({
    title: title,
    content: (
      <div>
        <p>{content}</p>
      </div>
    ),
    onOk: handleOk,
    centered: true,
  });
};

export const success = (title, content, handleOk) => {
  Modal.success({
    title: title,
    content: content,
    onOk: handleOk,
    centered: true,
  });
};

export const error = (title, content, handleOk) => {
  Modal.error({
    title: title,
    content: content,
    onOk: handleOk,
    centered: true,
  });
};

export const warning = (title, content, handleOk) => {
  Modal.warning({
    title: title,
    content: content,
    onOk: handleOk,
    centered: true,
  });
};
