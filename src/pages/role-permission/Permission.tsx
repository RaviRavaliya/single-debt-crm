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
  TablePagination
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

interface Permission {
  permissionName: string;
  status: string;
}

const Permission = () => {
  const [open, setOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Handle open modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Handle close modal
  const handleClose = () => {
    setOpen(false);
    setEditingPermission(null);
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
        popup: 'swal-custom-zindex'
      }
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
        popup: 'swal-custom-zindex'
      }
    });
  };

  // Handle delete confirmation
  const handleDelete = (permissionName: string) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        popup: 'swal-custom-zindex'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedPermissions = permissions.filter((perm) => perm.permissionName !== permissionName);
        localStorage.setItem('permissions', JSON.stringify(updatedPermissions));
        setPermissions(updatedPermissions);
        MySwal.fire('Deleted!', 'Permission has been deleted.', 'success');
      }
    });
  };

  // Form validation schema
  const validationSchema = Yup.object({
    permissionName: Yup.string().required('Permission name is required'),
    status: Yup.string().required('Status is required')
  });

  // Formik for form management
  const formik = useFormik({
    initialValues: {
      permissionName: '',
      status: ''
    },
    validationSchema,
    onSubmit: (values) => {
      try {
        const updatedPermissions = editingPermission
          ? permissions.map((perm) => (perm.permissionName === editingPermission.permissionName ? { ...values } : perm))
          : [...permissions, values];
        localStorage.setItem('permissions', JSON.stringify(updatedPermissions));
        setPermissions(updatedPermissions);

        handleSuccess(editingPermission ? 'Permission updated successfully' : 'Permission added successfully');
        handleClose();
        formik.resetForm();
      } catch (error) {
        handleError('Something went wrong while saving the permission');
      }
    }
  });

  // Load permissions from localStorage when the component mounts
  useEffect(() => {
    const savedPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    setPermissions(savedPermissions);
  }, []);

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter permissions based on search term and status filter
  const filteredPermissions = permissions.filter(
    (perm) => perm.permissionName.toLowerCase().includes(searchTerm.toLowerCase()) && (statusFilter === '' || perm.status === statusFilter)
  );

  // Paginate permissions
  const paginatedPermissions = filteredPermissions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Handle edit permission
  const handleEdit = (perm: Permission) => {
    setEditingPermission(perm);
    formik.setValues(perm);
    handleOpen();
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Top section with Add Permission button and search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <TextField
          placeholder="Search permissions"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
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
              backgroundColor: '#2980b9'
            },
            borderRadius: '24px',
            padding: '10px 20px'
          }}
        >
          Add Permission
        </Button>
      </div>

      {/* Permission table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Permission</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPermissions.map((permission, index) => (
              <TableRow key={index}>
                <TableCell>{page * rowsPerPage + index + 1}.</TableCell>
                <TableCell>{permission.permissionName}</TableCell>
                <TableCell>
                  <span
                    style={{
                      padding: '4px 12px',
                      color: '#fff',
                      borderRadius: '8px',
                      backgroundColor: permission.status === 'active' ? '#2ecc71' : '#e74c3c'
                    }}
                  >
                    {permission.status}
                  </span>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(permission)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(permission.permissionName)}>
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
        count={filteredPermissions.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
      />

      {/* Permission modal */}
      <Dialog open={open} onClose={handleClose} fullWidth PaperProps={{ style: { borderRadius: '16px', padding: '16px' } }}>
        <DialogTitle
          sx={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            background: '#e74c3c',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px 8px 0 0'
          }}
        >
          {editingPermission ? 'Edit Permission' : 'Add Permission'}
        </DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* Permission Name Field */}
                <TextField
                  fullWidth
                  select
                  id="permissionName"
                  name="permissionName"
                  label="Permission Name"
                  value={formik.values.permissionName}
                  onChange={formik.handleChange}
                  error={formik.touched.permissionName && Boolean(formik.errors.permissionName)}
                  helperText={formik.touched.permissionName && formik.errors.permissionName}
                >
                  <MenuItem value="edit"> Edit</MenuItem>
                  <MenuItem value="update"> Update</MenuItem>
                  <MenuItem value="delete">Delete </MenuItem>
                </TextField>
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
                  backgroundColor: '#c0392b'
                }
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
                  backgroundColor: '#2980b9'
                }
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

export default Permission;
