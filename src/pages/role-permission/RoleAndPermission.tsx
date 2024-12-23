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
  Autocomplete,
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

interface RolePermission {
  roleName: string;
  permissionNames: string[];
  status: string;
}

const RoleAndPermission = () => {
  const [open, setOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<RolePermission | null>(null);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  // Load roles and permissions from localStorage on component mount
  useEffect(() => {
    const savedRoles = JSON.parse(localStorage.getItem('roles') || '[]').map((role: any) => role.roleName);
    const savedPermissions = JSON.parse(localStorage.getItem('permissions') || '[]').map((perm: any) => perm.permissionName);
    setRoles(savedRoles);
    setPermissions(savedPermissions);
  }, []);

  // Handle modal open
  const handleOpen = () => {
    setOpen(true);
  };

  // Handle modal close
  const handleClose = () => {
    setOpen(false);
    setEditingAssignment(null);
    formik.resetForm();
  };

  // Form validation schema
  const validationSchema = Yup.object({
    roleName: Yup.string().required('Role is required'),
    permissionNames: Yup.array().min(1, 'At least one permission is required').required('Permission is required'),
    status: Yup.string().required('Status is required'),
  });

  // Formik for form management
  const formik = useFormik({
    initialValues: {
      roleName: '',
      permissionNames: [] as string[], // Initialize as array for multiple select
      status: '',
    },
    validationSchema,
    onSubmit: (values) => {
      try {
        const updatedAssignments = editingAssignment
          ? rolePermissions.map((assignment) =>
              assignment.roleName === editingAssignment.roleName ? { ...values } : assignment
            )
          : [...rolePermissions, values];

        localStorage.setItem('rolePermissions', JSON.stringify(updatedAssignments));
        setRolePermissions(updatedAssignments);

        handleSuccess(editingAssignment ? 'Assignment updated successfully' : 'Assignment added successfully');
        handleClose();
        formik.resetForm();
      } catch (error) {
        handleError('Something went wrong while saving the assignment');
      }
    },
  });

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
        const updatedAssignments = rolePermissions.filter(
          (assignment) => assignment.roleName !== roleName
        );
        localStorage.setItem('rolePermissions', JSON.stringify(updatedAssignments));
        setRolePermissions(updatedAssignments);
        MySwal.fire('Deleted!', 'Assignment has been deleted.', 'success');
      }
    });
  };

  // Handle edit assignment
  const handleEdit = (assignment: RolePermission) => {
    setEditingAssignment(assignment);
    formik.setValues(assignment);
    handleOpen();
  };

  // Load rolePermissions from localStorage when the component mounts
  useEffect(() => {
    const savedAssignments = JSON.parse(localStorage.getItem('rolePermissions') || '[]');
    setRolePermissions(savedAssignments);
  }, []);

  // Filter assignments based on search term and status
  const filteredAssignments = rolePermissions.filter(
    (assignment) =>
      (assignment.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (assignment.permissionNames || []).join(', ').toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === '' || assignment.status === statusFilter)
  );

  // Pagination and Rows per page
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Top section with Add Assignment button and search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <TextField
          placeholder="Search role or permission"
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
          Assign Role & Permission
        </Button>
      </div>

      {/* RolePermission table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((assignment, index) => (
                <TableRow key={index}>
                  <TableCell>{page * rowsPerPage + index + 1}.</TableCell>
                  <TableCell>{assignment.roleName}</TableCell>
                  <TableCell>{(assignment.permissionNames || []).join(', ')}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        padding: '4px 12px',
                        color: '#fff',
                        borderRadius: '8px',
                        backgroundColor: assignment.status === 'active' ? '#2ecc71' : '#e74c3c',
                      }}
                    >
                      {assignment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(assignment)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(assignment.roleName)}>
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
        count={filteredAssignments.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50]}
      />

      {/* Assignment modal */}
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
          {editingAssignment ? 'Edit Assignment' : 'Add Assignment'}
        </DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* Role Name Field */}
                <TextField
                  fullWidth
                  select
                  id="roleName"
                  name="roleName"
                  label="Role"
                  value={formik.values.roleName}
                  onChange={formik.handleChange}
                  error={formik.touched.roleName && Boolean(formik.errors.roleName)}
                  helperText={formik.touched.roleName && formik.errors.roleName}
                >
                  {roles.map((role, index) => (
                    <MenuItem key={index} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                {/* Permission Names Field (Multiple Select) */}
                <Autocomplete
                  multiple
                  id="permissionNames"
                  options={permissions}
                  getOptionLabel={(option) => option}
                  value={formik.values.permissionNames}
                  onChange={(event, newValue) => formik.setFieldValue('permissionNames', newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Permissions"
                      error={formik.touched.permissionNames && Boolean(formik.errors.permissionNames)}
                      helperText={formik.touched.permissionNames && formik.errors.permissionNames}
                    />
                  )}
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

export default RoleAndPermission;
