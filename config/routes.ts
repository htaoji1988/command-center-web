export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: '欢迎页',
    icon: 'smile',
    component: './Welcome',
  },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  {
    name: '配置中心',
    icon: 'table',
    path: '/setting',
    routes: [
      {
        path: '/setting/splunk/',
        name: 'splunk',
        icon: 'smile',
        component: './Setting/Splunk/',
      },
    ]
  },
  {
    name: '用户&角色',
    icon: 'UserOutlined',
    path: '/user_permission',
    routes: [
      {
        path: '/user_permission/usermanage',
        name: '用户管理',
        icon: 'smile',
        component: './UserManage/Users',
      },
      {
        path: '/user_permission/rolemanage',
        name: '角色管理',
        icon: 'smile',
        component: './UserManage/Roles',
      },
      // {
      //   path: '/user_permission/rolepermission',
      //   name: 'permissions',
      //   icon: 'smile',
      //   component: './UserManage/Permissions',
      // },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/test',
    name: '测试页',
    icon: 'crown',
    access: 'canAdmin|canGuest',
    routes: [
      {
        path: '/test/testpage',
        name: '测试页',
        icon: 'smile',
        access: 'canAdmin|canGuest',
        component: './UserManage',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
