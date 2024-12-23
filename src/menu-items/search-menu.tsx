// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { SearchNormal } from 'iconsax-react'; // Assume this icon represents your search category

// type
import { NavItemType } from 'types/menu';
import React from 'react';

// icons
const icons = {
  search: SearchNormal,
};

// ==============================|| MENU ITEMS - SEARCH ||============================== //

const searchMenu: NavItemType = {
  id: 'group-search', // Renamed to 'group-search'
  title: <FormattedMessage id="search" defaultMessage="Search" />, // Updated title to "Search"
  icon: icons.search,
  type: 'group',
  children: [
    {
      id: 'search',
      title: <FormattedMessage id="search" defaultMessage="Search" />,
      type: 'item',
      url: '/search', // Updated URL
      breadcrumbs: false,
      icon: icons.search
    }
  ]
};

export default searchMenu;
