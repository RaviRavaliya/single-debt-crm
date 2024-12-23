// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { SecurityUser, UserCirlceAdd,UserSquare } from 'iconsax-react'; // Assume these icons exist for roles and permissions

// type
import { NavItemType } from 'types/menu';
import React from 'react';

// icons
const icons = {
  role: SecurityUser,
  permission: UserCirlceAdd,
  mapping: UserSquare
};

// ==============================|| MENU ITEMS - ROLE AND PERMISSION ||============================== //

const rolePermissionMenu: NavItemType = {
  id: 'group-role-permission', // Grouping for roles and permissions
  title: <FormattedMessage id="role_permission" defaultMessage="Role & Permission" />, // Group title
  icon: icons.role, // Group icon (could be any)
  type: 'group',
  children: [
    {
      id: 'rolemanagement',
      title: <FormattedMessage id="rolemanagement" defaultMessage="Role" />, // Role management menu item
      type: 'item',
      url: '/role-permission/role', // URL for role management
      breadcrumbs: false,
      icon: icons.role
    },
    {
      id: 'permissionmanagement',
      title: <FormattedMessage id="permissionmanagement" defaultMessage="Permission" />, // Permission management menu item
      type: 'item',
      url: '/role-permission/permission', // URL for permission management
      breadcrumbs: false,
      icon: icons.permission
    },
    {
        id: 'rolepermissionmapping',
        title: <FormattedMessage id="rolepermissionmapping" defaultMessage="Role & Permission Mapping" />, // Role & Permission Mapping
        type: 'item',
        url: '/role-permission/role-permission-mapping', // URL for Role-Permission Mapping
        breadcrumbs: false,
        icon: icons.mapping // New icon for mapping
      }
  ]
};

export default rolePermissionMenu;
