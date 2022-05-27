import {FooterToolbar, PageContainer} from "@ant-design/pro-layout";
import ProTable, {ActionType, ProColumns, TableDropdown} from "@ant-design/pro-table";
import {Button, Input, Dropdown, Menu, Tooltip, Popconfirm, Modal, Form, InputNumber, Select, Layout, message} from "antd";
import {Alert} from "antd";
import {PlusOutlined, EllipsisOutlined, FormOutlined, DeleteOutlined} from '@ant-design/icons';
import {FormattedMessage, useIntl} from "umi";
import {rule} from "@/services/ant-design-pro/api";
import {ModalForm, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import UpdateForm from "@/pages/UserManage/components/UpdateForm";
import ProDescriptions, {ProDescriptionsItemProps} from "@ant-design/pro-descriptions";
import React, {useRef, useState} from "react";
import request from 'umi-request';
const { Option } = Select;

message.config({  // 设置message通知的位置
  top: 50,
  rtl: false,
})

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
let roles: Record<string, role> = await getRoles();


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
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'is_active',
    // hideInSearch: true,
    // renderFormItem: (_, {defaultRender}) => {
    //   return defaultRender(_);
    // },
    // render: (_, record) => (
    //   record.is_active ? <Tag color={'green'} key={'启用'}>启用</Tag> : <Tag color={'red'} key={'停用'}>停用</Tag>
    // ),
    initialValue: 'true',
    valueEnum: {
      all: {text: '全部'},
      true: {text: '启用', status: 'Success'},
      false: {text: '停用', status: 'Error'},
    },
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
    valueEnum: {"all": {text: "全部"}, ...roles},
  },
  {
    title: '最后登录',
    dataIndex: 'last_login',
    valueType: 'dateTime',
    hideInSearch: true,
    width: 200,
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => (
      <>
        <Tooltip title="编辑" key="cyan">
          <Button type="link" size={'small'} icon={<FormOutlined/>}/>
        </Tooltip>&nbsp;
        <Tooltip title="删除" key="red">
          <Popconfirm
            title="确认删除这条信息吗?"
            // onConfirm={() => deleteRow(record.id)}
            // onCancel={() => cancelRrow(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" size={'small'} icon={<DeleteOutlined/>}/>
          </Popconfirm>
        </Tooltip>
      </>
    ),
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
  const layout = {
    labelCol: {span: 5, offset: 1},
    wrapperCol: {span: 14, offset: 0}
  };

  const [formId, setFormId] = useState('')
  const [formUsername, setFormUsername] = useState('')
  const [formPassword, setFormPassword] = useState('')
  // const [formMail, setFormMail] = useState('')
  // const [formNickname, setFormNickname] = useState('')
  // const [formSex, setFormSex] = useState('')
  const [formRole, setFormRole] = useState('')
  // const [formStatus, setFormStatus] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const [form] = Form.useForm();
  form.setFieldsValue({
    id: formId,
    username: formUsername,
    password: formPassword,
  })

  const select_roles = (roles: Record<string, role>): {label:string, value:string}[] => {
    let res: {label:string, value:string}[] = [];
    let k: string;
    for(k in roles){
      console.log(k);
      res.push({label:k, value:k });
    }
    return res;
  }

  const addModel = () => {
    setIsEdit(false)
    setIsModalVisible(true)
  }

  const addOK = async () => {
    setConfirmLoading(true)
    console.log("addinfo")
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      // axios.post('/accounts/add_memcache/', qs.stringify(values), {headers}).then(response => {
      //   console.log(response.data.success)
      //   setConfirmLoading(false)
      //   response.data.success === "True" ? message.success('添加成功') : message.error('添加失败: ' + response.data.content)
      //   setIsModalVisible(false)
      // })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      setConfirmLoading(false);
      message.error('添加失败: ' + errorInfo);
    }
  }

  const editOK = async () => {
    setConfirmLoading(true)
    console.log("editinfo")
    // try {
    //   const values = await form.validateFields();
    //   console.log('Success:', values);
    //   axios.post('/accounts/update_memcache/', qs.stringify(values), {headers}).then(response => {
    //     console.log(response.data.success)
    //     setConfirmLoading(false)
    //     response.data.success === "True" ? message.success('编辑成功') : message.error('编辑失败: ' + response.data.content)
    //     setIsModalVisible(false)
    //   })
    // } catch (errorInfo) {
    //   console.log('Failed:', errorInfo)
    //   setConfirmLoading(false)
    //   message.error('编辑失败: ' + errorInfo)
    // }
  }

  const handleCancel = () => setIsModalVisible(false)

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
          <Button key="button" icon={<PlusOutlined/>} onClick={addModel} type="primary">
            新建
          </Button>,
          <Dropdown key="menu" overlay={menu}>
            <Button>
              <EllipsisOutlined/>
            </Button>
          </Dropdown>,
        ]}
      />
      <Modal title={isEdit ? "编辑用户信息" : "新增用户信息"} visible={isModalVisible} okText="确认" cancelText="取消"
             onOk={isEdit ? editOK : addOK} confirmLoading={confirmLoading} onCancel={handleCancel}>
        <Form {...layout} name="nest-messages" form={form}>
          <Form.Item name='id' label="ID" hidden={!isEdit} initialValue={formId} rules={[]} wrapperCol={{span: 5}}>
            <InputNumber readOnly={true}/>
          </Form.Item>
          <Form.Item name='username' label="用户名" initialValue={formUsername}
                     rules={[
                       {
                         required: true,
                         max: 255
                       },
                     ]}
          >
            <Input onChange={(e) => setFormUsername(e.target.value)}/>
          </Form.Item>
          <Form.Item name='password' label="密码" initialValue={formPassword}
                     rules={[
                       {
                         required: true,
                         max: 255
                       },
                     ]}
          >
            <Input.Password onChange={(e) => setFormPassword(e.target.value)}/>
          </Form.Item>
          <Form.Item name='role' label="角色" initialValue={formRole}
                     rules={[]}
          >
            <Select defaultValue="" style={{ width: 120 }} onChange={(e) => setFormRole(e)}
                    options = {select_roles(roles)}>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Users;
