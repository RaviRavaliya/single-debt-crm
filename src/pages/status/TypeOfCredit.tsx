import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  MenuItem,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  InputAdornment,
  TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import * as Yup from 'yup';
import { useFormik } from 'formik';

// Initialize Swal with React content
const MySwal = withReactContent(Swal);

interface TypeOfCredit {
  name: string;
  status: string;
}

const TypeOfCredit = () => {
  const [open, setOpen] = useState(false);
  const [editingTypeOfCredit, setEditingTypeOfCredit] = useState<TypeOfCredit | null>(null);
  const [typesOfCredit, setTypesOfCredit] = useState<TypeOfCredit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  // Load typesOfCredit from localStorage when the component mounts
  useEffect(() => {
    const savedTypesOfCredit = JSON.parse(localStorage.getItem('typesOfCredit') || '[]');
    setTypesOfCredit(savedTypesOfCredit);
  }, []);

  // Handle open modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Handle close modal
  const handleClose = () => {
    setOpen(false);
    setEditingTypeOfCredit(null);
    formik.resetForm();
  };

  // Handle form submission success
  const handleSuccess = (message: string) => {
    MySwal.fire({
      title: 'Success',
      text: message,
      icon: 'success',
      confirmButtonText: 'Ok',
      customClass: {
        popup: 'swal-custom-zindex',
      },
    });
  };

  // Handle form submission error
  const handleError = (message: string) => {
    MySwal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonText: 'Ok',
      customClass: {
        popup: 'swal-custom-zindex',
      },
    });
  };

  // Handle delete confirmation
  const handleDelete = (name: string) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        popup: 'swal-custom-zindex',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTypesOfCredit = typesOfCredit.filter((typeOfCredit) => typeOfCredit.name !== name);
        localStorage.setItem('typesOfCredit', JSON.stringify(updatedTypesOfCredit));
        setTypesOfCredit(updatedTypesOfCredit);
        MySwal.fire('Deleted!', 'Type of Credit has been deleted.', 'success');
      }
    });
  };

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    status: Yup.string().required('Status is required'),
  });

  // Formik for form management
  const formik = useFormik({
    initialValues: {
      name: '',
      status: '',
    },
    validationSchema,
    onSubmit: (values) => {
      try {
        const updatedTypesOfCredit = editingTypeOfCredit
          ? typesOfCredit.map((typeOfCredit) =>
              typeOfCredit.name === editingTypeOfCredit.name ? { ...values } : typeOfCredit
            )
          : [...typesOfCredit, values];
        localStorage.setItem('typesOfCredit', JSON.stringify(updatedTypesOfCredit));
        setTypesOfCredit(updatedTypesOfCredit);

        handleSuccess(editingTypeOfCredit ? 'Type of Credit updated successfully' : 'Type of Credit added successfully');
        handleClose();
        formik.resetForm();
      } catch (error) {
        handleError('Something went wrong while saving the Type of Credit');
      }
    },
  });

  // Filter typesOfCredit based on search term and status filter
  const filteredTypesOfCredit = typesOfCredit.filter(
    (typeOfCredit) =>
      typeOfCredit.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === '' || typeOfCredit.status === statusFilter)
  );

  // Pagination and Rows per page
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle edit typeOfCredit
  const handleEdit = (typeOfCredit: TypeOfCredit) => {
    setEditingTypeOfCredit(typeOfCredit);
    formik.setValues(typeOfCredit);
    handleOpen();
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Top section with Add Type of Credit button and search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <TextField
          placeholder="Search type of credit"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: '50%' }}
        />

        <TextField
          select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          label="Filter by Status"
          sx={{ width: '25%' }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{
            backgroundColor: '#3498db',
            '&:hover': {
              backgroundColor: '#2980b9',
            },
            borderRadius: '24px',
            padding: '10px 20px',
          }}
        >
          Add Credit Type
        </Button>
      </div>

      {/* TypeOfCredit table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTypesOfCredit
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((typeOfCredit, index) => (
                <TableRow key={index}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{typeOfCredit.name}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        padding: '4px 12px',
                        color: '#fff',
                        borderRadius: '8px',
                        backgroundColor: typeOfCredit.status === 'active' ? '#2ecc71' : '#e74c3c',
                      }}
                    >
                      {typeOfCredit.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(typeOfCredit)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(typeOfCredit.name)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredTypesOfCredit.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
      />

      {/* Type of Credit modal */}
      <Dialog open={open} onClose={handleClose} fullWidth PaperProps={{ style: { borderRadius: '16px', padding: '16px' } }}>
        <DialogTitle
          sx={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            background: '#e74c3c',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px 8px 0 0',
          }}
        >
          {editingTypeOfCredit ? 'Edit Type of Credit' : 'Add Type of Credit'}
        </DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* Name Field */}
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>

              <Grid item xs={12}>
                {/* Status Field */}
                <TextField
                  fullWidth
                  select
                  id="status"
                  name="status"
                  label="Status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'flex-end', padding: '16px', backgroundColor: '#f0f0f0' }}>
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{
                backgroundColor: '#e74c3c',
                color: '#fff',
                borderRadius: '24px',
                padding: '10px 24px',
                '&:hover': {
                  backgroundColor: '#c0392b',
                },
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#3498db',
                color: '#fff',
                borderRadius: '24px',
                padding: '10px 24px',
                marginLeft: '16px',
                '&:hover': {
                  backgroundColor: '#2980b9',
                },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default TypeOfCredit;
