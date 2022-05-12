import {FooterToolbar, PageContainer} from "@ant-design/pro-layout";
import ProTable, {ActionType, ProColumns, TableDropdown} from "@ant-design/pro-table";
import {Button, Drawer, Input, Space, Tag, Dropdown, Menu} from "antd";
import {PlusOutlined, EllipsisOutlined} from '@ant-design/icons';
import {FormattedMessage, useIntl} from "umi";
import {rule} from "@/services/ant-design-pro/api";
import {ModalForm, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import UpdateForm from "@/pages/UserManage/components/UpdateForm";
import ProDescriptions, {ProDescriptionsItemProps} from "@ant-design/pro-descriptions";
import React, {useRef, useState} from "react";
import request from 'umi-request';

type User = {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  nickname?: string;
  role__name: string;
  last_login?: string;
};

type role = {
  text: string;
  status?: string;
};

const getRoles = async () => {
  return request<Record<string, role>>('/api/user/roles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    },
    data: {},
  });
}
let roles:Record<string, role> = await getRoles();
console.log(roles);


const columns: ProColumns<User>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 50,
    hideInSearch: true,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    ellipsis: true, // 过长收缩
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    title: '姓名',
    dataIndex: 'nickname',
    ellipsis: true, // 过长收缩
  },
  {
    title: 'E-mail',
    dataIndex: 'email',
    ellipsis: true, // 过长收缩
    hideInSearch: true,
    width: 180,
  },
  {
    title: '状态',
    dataIndex: 'is_active',
    hideInSearch: true,
    renderFormItem: (_, {defaultRender}) => {
      return defaultRender(_);
    },
    render: (_, record) => (
      record.is_active ? <Tag color={'green'} key={'启用'}>启用</Tag> : <Tag color={'red'} key={'停用'}>停用</Tag>
    ),
  },
  {
    title: '角色',
    dataIndex: 'role__name',
    ellipsis: true, // 过长收缩
    initialValue: 'all',
    hideInForm: true,
    // valueEnum: {
    //   all: {text: '全部', status: 'Default'},
    //   open: {
    //     text: '未解决',
    //     status: 'Error',
    //   },
    //   closed: {
    //     text: '已解决',
    //     status: 'Success',
    //     disabled: true,
    //   },
    //   processing: {
    //     text: '解决中',
    //     status: 'Processing',
    //   },
    // },
    valueEnum: {"all":{text:"全部"},...roles},
  },
  {
    title: '最后登录',
    dataIndex: 'last_login',
    valueType: 'dateTime',
    hideInSearch: true,
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          {key: 'copy', name: '复制'},
          {key: 'delete', name: '删除'},
        ]}
      />,
    ],
  },
];

const menu = (
  <Menu>
    <Menu.Item key="1">1st item</Menu.Item>
    <Menu.Item key="2">2nd item</Menu.Item>
    <Menu.Item key="3">3rd item</Menu.Item>
  </Menu>
);


const Users: React.FC = () => {
  const actionRef = useRef<ActionType>();
  return (
    <PageContainer title={false}>
      <ProTable<User, API.PageParams>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          console.log(sort, filter);
          return request<{ data: User[]; }>('/api/user/userinfo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Access-Control-Allow-Origin': '*'
            },
            data: params,
          });
        }}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
          onChange(value) {
            console.log('value: ', value);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 10,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="用户表格"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined/>} type="primary">
            新建
          </Button>,
          <Dropdown key="menu" overlay={menu}>
            <Button>
              <EllipsisOutlined/>
            </Button>
          </Dropdown>,
        ]}
      />
    </PageContainer>
  );
};

export default Users;
