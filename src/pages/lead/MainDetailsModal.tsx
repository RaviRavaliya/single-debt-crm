import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material'; // This is correct
import { v4 as uuidv4 } from 'uuid';

interface MainDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

// Initialize SweetAlert with React content
const MySwal = withReactContent(Swal);

export default function MainDetailsModal({
  open,
  onClose,
  onSave,
}: MainDetailsModalProps) {

  const [details, setDetails] = useState<any | null>(null);
  // Load details from local storage on component mount
  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem('mainDetailsData') || 'null');
    if (savedDetails) {
      setDetails({
        ...savedDetails
      });
    }
  }, []);

  const [initialValues, setInitialValues] = useState({
    disposableIncome: '', // Placeholder for calculated field
    email: '',
    accountManager: '',
    accountStatus: '',
    customerType: '',
    leadUniqueId: '',
    leadStatus: '', // New field for Lead Status
  });

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('mainDetailsData');
    if (savedData) {
      setInitialValues(JSON.parse(savedData));
    }
  }, [open]);


    // State to hold dynamic values for input fields
  const [leadStatusIDValue, setLeadStatusIDValue] = useState('');

  // Generate random strings when the component mounts
  useEffect(() => {
    setLeadStatusIDValue(uuidv4());
  }, []);

  const validationSchema = Yup.object({
    disposableIncome: Yup.number()
      .typeError('Disposable Income must be a number')
      .required('Disposable Income is required'),
    email: Yup.string()
      .email('Enter a valid email')
      .required('Email is required'),
    accountManager: Yup.string()
      .required('Account Manager is required'),
    accountStatus: Yup.string()
      .required('Account Status is required'),
    customerType: Yup.string()
      .required('Customer Type is required'),
    leadStatus: Yup.string()
      .required('Lead Status is required'),
    leadUniqueId: Yup.string()
      .required('Lead Unique ID is required')
  });
  
  const accountManagers = ['John Doe', 'Jane Smith', 'Michael Clark', 'Anna Taylor']; // Dummy data for account managers
  const accountStatuses = ['Active', 'Inactive', 'Suspended'];
  const customerTypes = ['New', 'Returning', 'VIP'];
  const leadStatuses = ['New', 'In Progress', 'Closed', 'Rejected'];

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onClose()
      MySwal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save these changes?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, save it!',
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('mainDetailsData', JSON.stringify(values));
          setDetails(values);
          Swal.fire('Saved!', 'Your data has been saved.', 'success');
          onSave(values);
          onClose();
        }
      });
    },
  });
  // // Update Formik values when state changes
  // useEffect(() => {
  //   formik.setFieldValue('leadUniqueId', leadStatusIDValue);
  // }, [leadStatusIDValue]);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{ style: { borderRadius: '16px', padding: '16px' } }}
    >
      <DialogTitle
        sx={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          background: '#e74c3c',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {initialValues?.leadStatus ? 'Edit Main Details' : 'Add Main Details'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
          <Grid container spacing={2}>
            {/* Disposable Income */}
            <Grid item xs={12}>
              <TextField
              type='number'
                fullWidth
                id="disposableIncome"
                name="disposableIncome"
                  label="Disposable Income (₹)"
                value={formik.values.disposableIncome}
                onChange={formik.handleChange}
                error={formik.touched.disposableIncome && Boolean(formik.errors.disposableIncome)}
                helperText={
                  formik.touched.disposableIncome && typeof formik.errors.disposableIncome === 'string'
                    ? formik.errors.disposableIncome
                    : undefined
                }
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={
                  formik.touched.email && typeof formik.errors.email === 'string'
                    ? formik.errors.email
                    : undefined
                }
              />
            </Grid>

            {/* Account Manager - Dropdown */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                id="accountManager"
                name="accountManager"
                label="Account Manager"
                value={formik.values.accountManager}
                onChange={formik.handleChange}
                error={formik.touched.accountManager && Boolean(formik.errors.accountManager)}
                helperText={
                  formik.touched.accountManager && typeof formik.errors.accountManager === 'string'
                    ? formik.errors.accountManager
                    : undefined
                }
              >
                {accountManagers.map((manager) => (
                  <MenuItem key={manager} value={manager}>
                    {manager}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Account Status - Dropdown */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                id="accountStatus"
                name="accountStatus"
                label="Account Status"
                value={formik.values.accountStatus}
                onChange={formik.handleChange}
                error={formik.touched.accountStatus && Boolean(formik.errors.accountStatus)}
                helperText={
                  formik.touched.accountStatus && typeof formik.errors.accountStatus === 'string'
                    ? formik.errors.accountStatus
                    : undefined
                }
              >
                {accountStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Customer Type - Dropdown */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                id="customerType"
                name="customerType"
                label="Customer Type"
                value={formik.values.customerType}
                onChange={formik.handleChange}
                error={formik.touched.customerType && Boolean(formik.errors.customerType)}
                helperText={
                  formik.touched.customerType && typeof formik.errors.customerType === 'string'
                    ? formik.errors.customerType
                    : undefined
                }
              >
                {customerTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Lead Status - Dropdown */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                id="leadStatus"
                name="leadStatus"
                label="Lead Status"
                value={formik.values.leadStatus}
                onChange={formik.handleChange}
                error={formik.touched.leadStatus && Boolean(formik.errors.leadStatus)}
                helperText={
                  formik.touched.leadStatus && typeof formik.errors.leadStatus === 'string'
                    ? formik.errors.leadStatus
                    : undefined
                }
              >
                {leadStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Lead Unique ID */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="leadUniqueId"
                name="leadUniqueId"
                label="Lead Unique ID"
                value={formik.values.leadUniqueId}
                onChange={formik.handleChange}
                error={formik.touched.leadUniqueId && Boolean(formik.errors.leadUniqueId)}
                helperText={
                  formik.touched.leadUniqueId && typeof formik.errors.leadUniqueId === 'string'
                    ? formik.errors.leadUniqueId
                    : undefined
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', padding: '16px' }}>
          <Button
            onClick={onClose}
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
           {details ? "Update" :"Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
