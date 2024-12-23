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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material'; // This is correct


// Initialize Swal with React content
const MySwal = withReactContent(Swal);

interface LeadDetails {
  prefix: string;
  firstName: string;
  lastName: string;
  leadName: string;
  emailID: string;
  secondaryEmail?: string;
  phoneNumber: string;
  alternatePhoneNumber?: string;
  whatsappNumber?: string;
  accountManager: string;
  legalManager: string;
  leadOwner: string;
  customerType: string;
  accountStatus: string;
  leadCreatedTime: Date;
  modifiedTime: Date;
}

interface LeadDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;

}

export default function LeadDetailsModal({ open, onClose,onSave }: LeadDetailsModalProps) {
  const [details, setDetails] = useState<LeadDetails | null>(null);
  // Load details from local storage on component mount
  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem('leadDetails') || 'null');
    if (savedDetails) {
      setDetails({
        ...savedDetails
      });
    }
  }, []);
  const [initialValues, setInitialValues] = useState<LeadDetails>({
    prefix: 'Mr.',
    firstName: '',
    lastName: '',
    leadName: '',
    emailID: '',
    secondaryEmail: '',
    phoneNumber: '',
    alternatePhoneNumber: '',
    whatsappNumber: '',
    accountManager: 'User',
    legalManager: 'User',
    leadOwner: 'User',
    customerType: 'New',
    accountStatus: 'Active',
    leadCreatedTime: new Date(),
    modifiedTime: new Date(),
  });

  useEffect(() => {
    const savedDetails = localStorage.getItem('leadDetails');
    if (savedDetails) {
      const parsedDetails = JSON.parse(savedDetails);
      parsedDetails.leadCreatedTime = new Date(parsedDetails.leadCreatedTime);
      parsedDetails.modifiedTime = new Date(parsedDetails.modifiedTime);
      setInitialValues(parsedDetails);
    }
  }, []);
  

  const validationSchema = Yup.object({
    prefix: Yup.string().required('Prefix is required'),
    firstName: Yup.string()
      .required('First Name is required')
      .matches(/^[a-zA-Z\s]+$/, 'First Name must only contain letters and spaces'), // Allow only letters and spaces
    lastName: Yup.string()
      .required('Last Name is required')
      .matches(/^[a-zA-Z\s]+$/, 'Last Name must only contain letters and spaces'), // Allow only letters and spaces
    leadName: Yup.string()
      .required('Lead Name is required')
      .matches(/^[a-zA-Z\s]+$/, 'Lead Name must only contain letters and spaces'), // Allow only letters and spaces
    emailID: Yup.string()
      .email('Enter a valid email')
      .required('Email ID is required'),
    secondaryEmail: Yup.string().email('Enter a valid email'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone Number must be exactly 10 digits')
      .required('Phone Number is required'),
    alternatePhoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'Alternate Phone Number must be exactly 10 digits'),
    whatsappNumber: Yup.string()
      .matches(/^[0-9]{10}$/, 'WhatsApp Number must be exactly 10 digits'),
    accountManager: Yup.string()
      .required('Account Manager is required')
      .matches(/^[a-zA-Z\s]+$/, 'Account Manager must only contain letters and spaces'), // Allow only letters and spaces
    legalManager: Yup.string()
      .required('Legal Manager is required')
      .matches(/^[a-zA-Z\s]+$/, 'Legal Manager must only contain letters and spaces'), // Allow only letters and spaces
    leadOwner: Yup.string()
      .required('Lead Owner is required')
      .matches(/^[a-zA-Z\s]+$/, 'Lead Owner must only contain letters and spaces'), // Allow only letters and spaces
    customerType: Yup.string().required('Customer Type is required'),
    accountStatus: Yup.string().required('Account Status is required'),
    leadCreatedTime: Yup.date().required('Lead Created Time is required'),
    modifiedTime: Yup.date().required('Modified Time is required'),
});

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true, // Allow the form to update with initialValues changes
    validationSchema,
    onSubmit: (values) => {
      onClose()
      MySwal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save this data?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, save it!',
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('leadDetails', JSON.stringify(values));
          setDetails(values);
          onClose();
          onSave(values)
          Swal.fire('Saved!', 'Your data has been saved.', 'success');
        }
      });
      
    },
  });

  // Handle numeric-only input for phone numbers
  const handleNumberInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (/^\d*$/.test(value)) {
      formik.handleChange(event);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} fullWidth PaperProps={{ style: { borderRadius: '16px', padding: '16px' } }}>
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
          {initialValues.firstName ? 'Edit Lead Details' : 'Add Lead Details'}
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
              {/* Prefix Field */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  id="prefix"
                  name="prefix"
                  label="Prefix"
                  value={formik.values.prefix}
                  onChange={formik.handleChange}
                  error={formik.touched.prefix && Boolean(formik.errors.prefix)}
                  helperText={formik.touched.prefix && formik.errors.prefix}
                >
                  <MenuItem value="Mr.">Mr.</MenuItem>
                  <MenuItem value="Ms.">Ms.</MenuItem>
                  <MenuItem value="Mrs.">Mrs.</MenuItem>
                </TextField>
              </Grid>
              {/* First Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  inputProps={{ maxLength: 15 }}
                />
              </Grid>
              {/* Last Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  inputProps={{ maxLength: 15 }}

                />
              </Grid>
              {/* Lead Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="leadName"
                  name="leadName"
                  label="Lead Name"
                  value={formik.values.leadName}
                  onChange={formik.handleChange}
                  error={formik.touched.leadName && Boolean(formik.errors.leadName)}
                  helperText={formik.touched.leadName && formik.errors.leadName}
                  inputProps={{ maxLength: 15 }}

                />
              </Grid>
              {/* Email ID */}
              <Grid item xs={12} md={6}>
                <TextField
                type='email'
                  fullWidth
                  id="emailID"
                  name="emailID"
                  label="Email ID"
                  value={formik.values.emailID}
                  onChange={formik.handleChange}
                  error={formik.touched.emailID && Boolean(formik.errors.emailID)}
                  helperText={formik.touched.emailID && formik.errors.emailID}
                />
              </Grid>
              {/* Secondary Email */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type='email'
                  id="secondaryEmail"
                  name="secondaryEmail"
                  label="Secondary Email"
                  value={formik.values.secondaryEmail}
                  onChange={formik.handleChange}
                  error={formik.touched.secondaryEmail && Boolean(formik.errors.secondaryEmail)}
                  helperText={formik.touched.secondaryEmail && formik.errors.secondaryEmail}
                />
              </Grid>
              {/* Phone Number */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                  type="tel"
                  value={formik.values.phoneNumber}
                  onChange={handleNumberInput}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              {/* Alternate Phone Number */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="alternatePhoneNumber"
                  name="alternatePhoneNumber"
                  label="Alternate Phone Number"
                  type="tel"
                  value={formik.values.alternatePhoneNumber}
                  onChange={handleNumberInput}
                  error={formik.touched.alternatePhoneNumber && Boolean(formik.errors.alternatePhoneNumber)}
                  helperText={formik.touched.alternatePhoneNumber && formik.errors.alternatePhoneNumber}
                  inputProps={{ maxLength: 10 }}
               />
              </Grid>
              {/* WhatsApp Number */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="whatsappNumber"
                  name="whatsappNumber"
                  label="WhatsApp Number"
                  type="tel"
                  value={formik.values.whatsappNumber}
                  onChange={handleNumberInput}
                  error={formik.touched.whatsappNumber && Boolean(formik.errors.whatsappNumber)}
                  helperText={formik.touched.whatsappNumber && formik.errors.whatsappNumber}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              {/* Account Manager */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  id="accountManager"
                  name="accountManager"
                  label="Account Manager"
                  value={formik.values.accountManager}
                  onChange={formik.handleChange}
                  error={formik.touched.accountManager && Boolean(formik.errors.accountManager)}
                  helperText={formik.touched.accountManager && formik.errors.accountManager}
                >
                  <MenuItem value="User">User</MenuItem>
                </TextField>
              </Grid>
              {/* Legal Manager */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  id="legalManager"
                  name="legalManager"
                  label="Legal Manager"
                  value={formik.values.legalManager}
                  onChange={formik.handleChange}
                  error={formik.touched.legalManager && Boolean(formik.errors.legalManager)}
                  helperText={formik.touched.legalManager && formik.errors.legalManager}
                >
                  <MenuItem value="User">User</MenuItem>
                </TextField>
              </Grid>
              {/* Lead Owner */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  id="leadOwner"
                  name="leadOwner"
                  label="Lead Owner"
                  value={formik.values.leadOwner}
                  onChange={formik.handleChange}
                  error={formik.touched.leadOwner && Boolean(formik.errors.leadOwner)}
                  helperText={formik.touched.leadOwner && formik.errors.leadOwner}
                >
                  <MenuItem value="User">User</MenuItem>
                </TextField>
              </Grid>
              {/* Customer Type */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  id="customerType"
                  name="customerType"
                  label="Customer Type"
                  value={formik.values.customerType}
                  onChange={formik.handleChange}
                  error={formik.touched.customerType && Boolean(formik.errors.customerType)}
                  helperText={formik.touched.customerType && formik.errors.customerType}
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Old">Old</MenuItem>
                </TextField>
              </Grid>
              {/* Account Status */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  id="accountStatus"
                  name="accountStatus"
                  label="Account Status"
                  value={formik.values.accountStatus}
                  onChange={formik.handleChange}
                  error={formik.touched.accountStatus && Boolean(formik.errors.accountStatus)}
                  helperText={formik.touched.accountStatus && formik.errors.accountStatus}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </Grid>
              {/* Lead Created Time */}
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Lead Created Time"
                  value={formik.values.leadCreatedTime}
                  onChange={(newValue) => formik.setFieldValue('leadCreatedTime', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              {/* Modified Time */}
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Modified Time"
                  value={formik.values.modifiedTime}
                  onChange={(newValue) => formik.setFieldValue('modifiedTime', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'flex-end', padding: '16px', backgroundColor: '#f0f0f0' }}>
              <Button
                onClick={onClose}
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
               {details ? "Update" :"Save"}
              </Button>
            </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}
