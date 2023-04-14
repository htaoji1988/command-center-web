/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    canGuest: currentUser && currentUser.access === 'guest',
    canMonitor: currentUser && currentUser.access === 'monitor',
    canIdc: currentUser && currentUser.access === 'idc',
    canSys: currentUser && currentUser.access === 'sys',
    canDba: currentUser && currentUser.access === 'dba',
  };
}
