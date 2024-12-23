// project-imports
// import applications from './applications';
// import widget from './widget';
// import formsTables from './forms-tables';
// import samplePage from './sample-page';
// import chartsMap from './charts-map';
// import support from './support';
// import pages from './pages';
import leadMenu from './lead';
import rolePermissionMenu from './rolePermissionMenu';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [leadMenu,rolePermissionMenu
    // widget, applications, formsTables, chartsMap, samplePage, pages, support
  ]
};

export default menuItems;
