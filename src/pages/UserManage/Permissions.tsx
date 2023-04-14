import {FooterToolbar, PageContainer} from "@ant-design/pro-layout";
import ProTable, {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, Input, Dropdown, Menu, Tooltip, Popconfirm, Modal, Form, InputNumber, Select, message} from "antd";
import {Alert, Layout} from "antd";
import {PlusOutlined, EllipsisOutlined, FormOutlined, DeleteOutlined} from '@ant-design/icons';
import {FormattedMessage, useIntl} from "umi";
import {rule} from "@/services/ant-design-pro/api";
import {ModalForm, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import UpdateForm from "@/pages/UserManage/components/UpdateForm";
import ProDescriptions, {ProDescriptionsItemProps} from "@ant-design/pro-descriptions";
import React, {useRef, useState} from "react";
import request from "umi-request";

const {Option} = Select;

// django 默认用x-www-form-urlencoded格式接受http数据
const headers = {"Content-Type": 'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin': '*'}

message.config({  // 设置message通知的位置
  top: 50,
  rtl: false,
})

type Permission = {
  id: number;
  name: string;
  url: string;
};

const Permissions: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const layout = {
    labelCol: {span: 5, offset: 1},
    wrapperCol: {span: 14, offset: 0}
  };

  const [formId, setFormId] = useState('')
  const [formName, setFormName] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const [form] = Form.useForm();
  form.setFieldsValue({
    id: formId,
    name: formName,
    url: formUrl
  })

  const addModel = () => {
    console.log("add model");
    setIsEdit(false);
    setIsModalVisible(true);
  }

  const addOK = async () => {
    setConfirmLoading(true)
    console.log("addinfo")
    const values = await form.validateFields();
    console.log('Success:', values);
    request.post('/api/user/add_permission', {
      header: {headers},
      data: await form.validateFields(),
    }).then(function (res) {
      if (res.success === 'True') {
        message.success('添加成功')
        actionRef.current.reload()
        // reloadTable(pageOption.page_no, pageOption.page_size)
      } else {
        message.error('添加失败: ' + res.log)
      }
    }).catch(function (error) {
      message.error(error)
    });
    setConfirmLoading(false)
    setIsModalVisible(false)
  }

  const editOK = async () => {
    setConfirmLoading(true)
    console.log("editinfo")
    const values = await form.validateFields();
    console.log('Success:', values);
    request.post('/api/user/update_permission', {
      header: {headers},
      data: await form.validateFields(),
    }).then(function (res) {
      if (res.success === 'True') {
        message.success('更新成功')
        actionRef.current.reload()
        // reloadTable(pageOption.page_no, pageOption.page_size)
      } else {
        message.error('更新失败: ' + res.log)
      }
    }).catch(function (error) {
      message.error(error)
    });
    setConfirmLoading(false)
    setIsModalVisible(false)
  }

  const handleCancel = () => setIsModalVisible(false)

  const deleteRow = (id: number, action: ActionType) => {
    console.log(id)
    request.post('/api/user/del_permission', {
      header: {headers}, data: {id: id},
    }).then(function (res) {
      console.log(res);
      if (res.success === 'True') {
        message.success('操作成功')
        action.reload()
        // reloadTable(pageOption.page_no, pageOption.page_size)
      } else {
        message.error('操作失败' + res.log)
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  const editRow = (record) => {
    console.log(record)
    setIsEdit(true)
    setIsModalVisible(true)
    setFormId(record.id)
    setFormName(record.name)
    setFormUrl(record.url)
  }

  const cancelRrow = (id: number) => {
    console.log("cancel" + id)
  }

  const columns: ProColumns<Permission>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 50,
      hideInSearch: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true, // 过长收缩
    },
    {
      title: 'URL',
      dataIndex: 'url',
      ellipsis: true, // 过长收缩
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => (
        <>
          <Tooltip title="编辑" key="cyan">
            <Button type="link" size={'small'} icon={<FormOutlined/>} onClick={() => editRow(record, action)}/>
          </Tooltip>&nbsp;
          <Tooltip title="删除" key="red">
            <Popconfirm
              title="确认删除这条信息吗?"
              onConfirm={() => deleteRow(record.id, action)}
              onCancel={() => cancelRrow(record.id)}
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

  return (
    <PageContainer title={false}>
      <ProTable<Permission, API.PageParams>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          console.log(sort, filter);
          return request<{ data: Permission[]; }>('/api/user/permissions', {
            method: 'POST',
            headers: {headers},
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
      <Modal title={isEdit ? "编辑权限" : "新增权限"} open={isModalVisible} okText="确认" cancelText="取消"
             onOk={isEdit ? editOK : addOK} confirmLoading={confirmLoading} onCancel={handleCancel} forceRender>
        <Form {...layout} name="nest-messages" form={form}>
          <Form.Item name='id' label="ID" hidden={!isEdit} initialValue={formId} rules={[]} wrapperCol={{span: 5}}>
            <InputNumber readOnly={true}/>
          </Form.Item>
          <Form.Item name='name' label="名称" rules={[{required: true, max: 255},]}>
            <Input onChange={(e) => setFormName(e.target.value)}/>
          </Form.Item>
          <Form.Item name='url' label="URL" rules={[{required: true, max: 255},]}>
            <Input onChange={(e) => setFormUrl(e.target.value)}/>
          </Form.Item>
        </Form>
      </Modal>

    </PageContainer>
  );
};

export default Permissions;
