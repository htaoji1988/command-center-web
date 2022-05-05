export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
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
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  {
    name: 'userPermission',
    icon: 'UserOutlined',
    path: '/user_permission',
    routes: [
      {
        path: '/user_permission/usermanage',
        name: 'userAdmin',
        icon: 'smile',
        component: './UserManage/Users',
      },
      {
        path: '/user_permission/rolemanage',
        name: 'roleAdmin',
        icon: 'smile',
        component: './UserManage/Roles',
      },
      {
        path: '/user_permission/rolepermission',
        name: 'permissions',
        icon: 'smile',
        component: './UserManage/Permissions',
      },
      {
        path: '/user_permission/testpage',
        name: 'testPage',
        icon: 'smile',
        component: './UserManage',
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
