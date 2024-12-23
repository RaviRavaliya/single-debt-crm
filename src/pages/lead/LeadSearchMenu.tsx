import React, { useState } from 'react';
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Pagination,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// Utility function to format the date as "YYYY-MM-DD" for filtering
const formatDate = (date: Date | null) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

interface LeadData {
  id: string;
  userSignInDate: Date;
  caseId: number;
  customerName: string;
  number: string;
  email: string;
  debtsLevel: number;
  caseStatus: string;
  userCaseType: string;
}

// Static data for the table
const leadData: LeadData[] = [
  {
    id: '1',
    userSignInDate: new Date('2023-09-19T06:03:31'),
    caseId: 169866,
    customerName: 'Manish',
    number: '01234567890',
    email: 'testmanish@gmail.com',
    debtsLevel: 425460,
    caseStatus: 'N84',
    userCaseType: 'Andapp',
  },
  {
    id: '2',
    userSignInDate: new Date('2023-09-22T05:19:53'),
    caseId: 149917,
    customerName: 'Maman',
    number: '01234567890',
    email: 'annana@mfan.com',
    debtsLevel: 11100,
    caseStatus: 'Not interested',
    userCaseType: 'Andapp',
  },
  {
    id: '3',
    userSignInDate: new Date('2023-09-25T09:15:45'),
    caseId: 160055,
    customerName: 'Rahul',
    number: '01234567891',
    email: 'rahul123@gmail.com',
    debtsLevel: 320000,
    caseStatus: 'Processing',
    userCaseType: 'Bankapp',
  },
  {
    id: '4',
    userSignInDate: new Date('2023-09-28T14:40:00'),
    caseId: 173010,
    customerName: 'Kavita',
    number: '01234567892',
    email: 'kavita@gmail.com',
    debtsLevel: 50000,
    caseStatus: 'Approved',
    userCaseType: 'Andapp',
  },
  {
    id: '5',
    userSignInDate: new Date('2023-10-01T11:45:20'),
    caseId: 185021,
    customerName: 'Shyam',
    number: '01234567893',
    email: 'shyam@yahoo.com',
    debtsLevel: 150000,
    caseStatus: 'Rejected',
    userCaseType: 'Creditapp',
  },
  {
    id: '6',
    userSignInDate: new Date('2023-10-05T08:00:00'),
    caseId: 190101,
    customerName: 'Priya',
    number: '01234567894',
    email: 'priya@hotmail.com',
    debtsLevel: 80000,
    caseStatus: 'Pending',
    userCaseType: 'Loanapp',
  },
  {
    id: '7',
    userSignInDate: new Date('2023-10-06T10:30:00'),
    caseId: 200202,
    customerName: 'Amit',
    number: '01234567895',
    email: 'amit@outlook.com',
    debtsLevel: 100000,
    caseStatus: 'In Review',
    userCaseType: 'Bankapp',
  },
  {
    id: '8',
    userSignInDate: new Date('2023-10-08T13:20:00'),
    caseId: 210303,
    customerName: 'Sanjay',
    number: '01234567896',
    email: 'sanjay@gmail.com',
    debtsLevel: 225000,
    caseStatus: 'Closed',
    userCaseType: 'Andapp',
  },
  {
    id: '9',
    userSignInDate: new Date('2023-10-10T15:45:00'),
    caseId: 220404,
    customerName: 'Rita',
    number: '01234567897',
    email: 'rita@yahoo.com',
    debtsLevel: 50000,
    caseStatus: 'Resolved',
    userCaseType: 'Creditapp',
  },
  {
    id: '10',
    userSignInDate: new Date('2023-10-12T09:00:00'),
    caseId: 230505,
    customerName: 'Vikas',
    number: '01234567898',
    email: 'vikas@gmail.com',
    debtsLevel: 200000,
    caseStatus: 'Approved',
    userCaseType: 'Loanapp',
  },
];


const LeadSearchMenu = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [filteredData, setFilteredData] = useState<LeadData[]>(leadData);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const navigate = useNavigate();


  // Handle search and filter
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchQuery(value);
    filterData(value, dateFilter);
  };

  const handleDateChange = (date: Date | null) => {
    setDateFilter(date);
    filterData(searchQuery, date);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDateFilter(null);
    setFilteredData(leadData);
    setCurrentPage(1);
  };

  const filterData = (searchValue: string, dateValue: Date | null) => {
    const formattedFilterDate = formatDate(dateValue);

    const filtered = leadData.filter((item) => {
      const formattedDate = formatDate(item.userSignInDate);
      const matchesSearch =
        item.customerName.toLowerCase().includes(searchValue) ||
        item.email.toLowerCase().includes(searchValue) ||
        item.caseStatus.toLowerCase().includes(searchValue) ||
        item.userCaseType.toLowerCase().includes(searchValue) ||
        item.number.includes(searchValue) ||
        item.caseId.toString().includes(searchValue) ||
        item.debtsLevel.toString().includes(searchValue) ||
        formattedDate.includes(searchValue); // Search based on date string

      const matchesDate = formattedFilterDate
        ? formattedDate === formattedFilterDate
        : true;

      return matchesSearch && matchesDate;
    });

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  // Handle pagination change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Calculate the data to display for the current page
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handle actions (view, edit, delete)
  const handleAction = (action: string, data: LeadData) => {
    if (action === 'view') {
      navigate(`/lead/lead-details`); // Redirect to LeadDetails page with the lead ID
      return;
    }
    Swal.fire({
      title: `Are you sure you want to ${action} this case?`,
      text: `You are about to ${action} the case for ${data.customerName}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Success!', `The case has been ${action}d.`, 'success');
      }
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 3, textAlign: 'center', color: '#2e7d32' }}>
        Lead Management System
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            label="Search by fields (e.g., Customer Name, Email, etc.)"
            value={searchQuery}
            onChange={handleSearch}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Filter by Date"
              value={dateFilter}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleResetFilters}
            fullWidth
            sx={{
              backgroundColor: '#ff7043',
              color: '#fff',
              '&:hover': { backgroundColor: '#ff5722' },
            }}
          >
            Reset Filters
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ marginTop: 4, borderRadius: '16px' }}>
        <Table sx={{ minWidth: 800 }} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>User Signin Date</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Case ID</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Customer Name</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Number</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Email</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Debts Level</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Case Status</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>User Case Type</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length ? (
              paginatedData.map((data) => (
                <TableRow key={data.id}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(data.userSignInDate)}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{data.caseId}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{data.customerName}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{data.number}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{data.email}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{data.debtsLevel}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{data.caseStatus}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{data.userCaseType}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="View Case">
                      <IconButton
                        color="primary"
                        onClick={() => handleAction('view', data)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: 'center' }}>
                  No matching records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
        <Pagination
          count={Math.ceil(filteredData.length / rowsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
          siblingCount={1}
          boundaryCount={1}
        />
      </Grid>
    </div>
  );
};

export default LeadSearchMenu;
