// third-party
import { FormattedMessage } from 'react-intl';

// assets
// import { Story, Fatrows, PresentionChart,Grid1 } from 'iconsax-react';
import { Grid1, SecurityUser, UserCirlceAdd,
   UserSquare, Building, Book, Bank, ChartSquare, SearchNormal1 } from 'iconsax-react'; // Assume these icons represent your categories

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  // widgets: Story,
  // statistics: Story,
  // data: Fatrows,
  // chart: PresentionChart
  lead: Grid1,
  accommodation: Building,
  education: Book,
  leadStatus: ChartSquare,
  source: UserSquare,
  accountStatus: Bank,
  legalStatus: SecurityUser,
  harassmentStatus: UserCirlceAdd,
  paymentStatus: Bank,
  bankType: Bank,
  creditType: ChartSquare,
  search: SearchNormal1
};

// ==============================|| MENU ITEMS - LEAD ||============================== //

const leadMenu: NavItemType = {
  id: 'group-lead', // Renamed to 'group-lead'
  title: <FormattedMessage id="lead" defaultMessage="Lead" />, // Updated title to "Lead"
  icon: icons.lead,
  type: 'group',
  children: [
    {
      id: 'leaddetails',
      title: <FormattedMessage id="leaddetails" defaultMessage="Lead-Details" />,
      type: 'item',
      url: '/lead/lead-details', // Updated URL
      breadcrumbs: false,
      icon: icons.lead
    },
    {
      id: 'search',
      title: <FormattedMessage id="search" defaultMessage="Search" />,
      type: 'item',
      url: '/lead/search', // Updated URL
      breadcrumbs: false,
      icon: icons.search
    },
    {
      id: 'status',
      title: <FormattedMessage id="status" defaultMessage="Status" />,
      type: 'collapse', // Making this a dropdown for multiple statuses
      icon: icons.accountStatus, // Icon for Status
      children: [
        {
          id: 'accommodationStatus',
          title: <FormattedMessage id="accommodationStatus" defaultMessage="Accommodation Status" />,
          type: 'item',
          url: '/lead/status/accommodation',
          breadcrumbs: false,
          icon: icons.accommodation
        },
        {
          id: 'educationStatus',
          title: <FormattedMessage id="educationStatus" defaultMessage="Education Status" />,
          type: 'item',
          url: '/lead/status/education',
          breadcrumbs: false,
          icon: icons.education
        },
        {
          id: 'leadStatus',
          title: <FormattedMessage id="leadStatus" defaultMessage="Lead Status" />,
          type: 'item',
          url: '/lead/status/lead',
          breadcrumbs: false,
          icon: icons.leadStatus
        },
        {
          id: 'source',
          title: <FormattedMessage id="source" defaultMessage="Source" />,
          type: 'item',
          url: '/lead/status/source',
          breadcrumbs: false,
          icon: icons.source
        },
        {
          id: 'accountStatus',
          title: <FormattedMessage id="accountStatus" defaultMessage="Account Status" />,
          type: 'item',
          url: '/lead/status/account',
          breadcrumbs: false,
          icon: icons.accountStatus
        },
        {
          id: 'legalStatus',
          title: <FormattedMessage id="legalStatus" defaultMessage="Legal Status" />,
          type: 'item',
          url: '/lead/status/legal',
          breadcrumbs: false,
          icon: icons.legalStatus
        },
        {
          id: 'harassmentStatus',
          title: <FormattedMessage id="harassmentStatus" defaultMessage="Harassment Status" />,
          type: 'item',
          url: '/lead/status/harassment',
          breadcrumbs: false,
          icon: icons.harassmentStatus
        },
        {
          id: 'paymentStatus',
          title: <FormattedMessage id="paymentStatus" defaultMessage="Payment Status" />,
          type: 'item',
          url: '/lead/status/payment',
          breadcrumbs: false,
          icon: icons.paymentStatus
        },
        {
          id: 'bankType',
          title: <FormattedMessage id="bankType" defaultMessage="Bank Type" />,
          type: 'item',
          url: '/lead/status/bank',
          breadcrumbs: false,
          icon: icons.bankType
        },
        {
          id: 'typeOfCredit',
          title: <FormattedMessage id="typeOfCredit" defaultMessage="Type of Credit" />,
          type: 'item',
          url: '/lead/status/credit',
          breadcrumbs: false,
          icon: icons.creditType
        }
      ]
    }
  ]
};

export default leadMenu;
