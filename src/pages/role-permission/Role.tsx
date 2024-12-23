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

interface Role {
  roleName: string;
  status: string;
}

const Role = () => {
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

  // Handle open modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Handle close modal
  const handleClose = () => {
    setOpen(false);
    setEditingRole(null);
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
  // Handle edit role
  const handleEdit = (role: Role) => {
    setEditingRole(role);
    formik.setValues(role);
    handleOpen();
  };

  // Handle delete confirmation
  const handleDelete = (roleName: string) => {
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
        const updatedRoles = roles.filter((role) => role.roleName !== roleName);
        localStorage.setItem('roles', JSON.stringify(updatedRoles));
        setRoles(updatedRoles);
        MySwal.fire('Deleted!', 'Role has been deleted.', 'success');
      }
    });
  };

  // Form validation schema
  const validationSchema = Yup.object({
    roleName: Yup.string().required('Role name is required'),
    status: Yup.string().required('Status is required'),
  });

  // Formik for form management
  const formik = useFormik({
    initialValues: {
      roleName: '',
      status: '',
    },
    validationSchema,
    onSubmit: (values) => {
      try {
        const updatedRoles = editingRole
          ? roles.map((role) =>
              role.roleName === editingRole.roleName ? { ...values } : role
            )
          : [...roles, values];
        localStorage.setItem('roles', JSON.stringify(updatedRoles));
        setRoles(updatedRoles);
        
        handleSuccess(editingRole ? 'Role updated successfully' : 'Role added successfully');
        handleClose();
        formik.resetForm();
      } catch (error) {
        handleError('Something went wrong while saving the role');
      }
    },
  });

  // Load roles from localStorage when the component mounts
  useEffect(() => {
    const savedRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    setRoles(savedRoles);
  }, []);

  // Filter roles based on search term
  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  // Paginated roles (data slicing based on current page and rows per page)
  const paginatedRoles = filteredRoles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div style={{ padding: '20px' }}>
      {/* Top section with Add Role button and search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <TextField
          placeholder="Search roles"
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
          Add Role
        </Button>
      </div>

      {/* Role table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>#</strong></TableCell> {/* Index Column */}
              <TableCell><strong>Role Name</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRoles.length > 0 ? (
              paginatedRoles.map((role, index) => (
                <TableRow key={index + page * rowsPerPage + 1}>
                  <TableCell>{index + 1 + page * rowsPerPage}.</TableCell> {/* Dynamic index based on page */}
                  <TableCell>{role.roleName}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        padding: '4px 12px',
                        color: '#fff',
                        borderRadius: '8px',
                        backgroundColor: role.status === 'active' ? '#2ecc71' : '#e74c3c',
                      }}
                    >
                      {role.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(role)}>
                      <EditIcon color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(role.roleName)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No roles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredRoles.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage="Rows per page:"
        sx={{ marginTop: '20px' }}
      />

      {/* Role modal */}
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
          {editingRole ? 'Edit Role' : 'Add Role'}
        </DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* Role Name Field */}
                <TextField
                  fullWidth
                  id="roleName"
                  name="roleName"
                  label="Role Name"
                  value={formik.values.roleName}
                  onChange={formik.handleChange}
                  error={formik.touched.roleName && Boolean(formik.errors.roleName)}
                  helperText={formik.touched.roleName && formik.errors.roleName}
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

export default Role;
