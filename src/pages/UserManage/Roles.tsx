import {FooterToolbar, PageContainer} from "@ant-design/pro-layout";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, Drawer, Input} from "antd";
import {FormattedMessage, useIntl} from "umi";
import {rule} from "@/services/ant-design-pro/api";
import {ModalForm, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import UpdateForm from "@/pages/UserManage/components/UpdateForm";
import ProDescriptions, {ProDescriptionsItemProps} from "@ant-design/pro-descriptions";
import React, {useRef, useState} from "react";

const Roles: React.FC = () => {
  return (
    <PageContainer title={false}>
      <div>New Page</div>
    </PageContainer>
  );
};

export default Roles;
