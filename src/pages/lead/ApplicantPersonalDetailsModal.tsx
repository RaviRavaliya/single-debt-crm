import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Helper function to calculate age
const calculateAge = (dob: Date) => {
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
    return age - 1;
  }
  return age;
};

interface ApplicantPersonalDetails {
  pancard: string;
  aadharCard: string;
  dateOfBirth: Date | null;
  ageOfClient: number;
  fatherName: string;
  motherName: string;
  wifeName: string;
  reasonForFinancialDifficulty: string;
  numberOfChildren: number;
}

interface ApplicantPersonalDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const MySwal = withReactContent(Swal);

export default function ApplicantPersonalDetailsModal({ open, onClose, onSave }: ApplicantPersonalDetailsModalProps) {
  const [details, setDetails] = useState<ApplicantPersonalDetails | null>(null);

  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem('applicantDetails') || 'null');
    if (savedDetails) {
      setDetails({
        ...savedDetails,
        dateOfBirth: savedDetails.dateOfBirth ? new Date(savedDetails.dateOfBirth) : null
      });
    }
  }, []);

  const formatAadharNumber = (value: string) => {
    return value.replace(/\s+/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  // Validation schema
  const validationSchema = Yup.object({
    pancard: Yup.string()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Pancard format is invalid (e.g., ABCDE1234F)')
      .required('Pancard is required'),
    aadharCard: Yup.string()
      .matches(/^\d{4}\s\d{4}\s\d{4}$/, 'Aadhar card must be a 12-digit number with spaces every 4 digits')
      .required('Aadhar card is required'),
    dateOfBirth: Yup.date()
      .nullable()
      .max(new Date(), 'Date of Birth must be older than the current date')
      .required('Date of Birth is required'),
    ageOfClient: Yup.number().required('Age of Client is required').min(1, 'Age must be at least 1'),
    fatherName: Yup.string()
      .matches(/^[A-Za-z ]*$/, 'Father Name must only contain letters')
      .required('Father Name is required'),
    motherName: Yup.string()
      .matches(/^[A-Za-z ]*$/, 'Mother Name must only contain letters')
      .required('Mother Name is required'),
    wifeName: Yup.string()
      .matches(/^[A-Za-z ]*$/, 'Wife Name must only contain letters')
      .required('Wife Name is required'),
    reasonForFinancialDifficulty: Yup.string()
      .matches(/^[A-Za-z ]*$/, 'Reason for financial difficulty must only contain letters')
      .required('Reason for financial difficulty is required'),
    numberOfChildren: Yup.number().required('Number of Children is required').min(0, 'Cannot be negative')
  });

  // Formik setup
  const formik = useFormik<ApplicantPersonalDetails>({
    initialValues: {
      pancard: details?.pancard || '',
      aadharCard: details?.aadharCard || '',
      dateOfBirth: details?.dateOfBirth || null,
      ageOfClient: details?.ageOfClient || 0,
      fatherName: details?.fatherName || '',
      motherName: details?.motherName || '',
      wifeName: details?.wifeName || '',
      reasonForFinancialDifficulty: details?.reasonForFinancialDifficulty || '',
      numberOfChildren: details?.numberOfChildren || 0
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      onClose();
      const result = await MySwal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save the details?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, save it!'
      });

      if (result.isConfirmed) {
        localStorage.setItem('applicantDetails', JSON.stringify(values));
        setDetails(values);
        MySwal.fire('Saved!', 'Data has been saved.', 'success');
        onSave(values);
        onClose();
      }
    }
  });

  return (
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
          alignItems: 'center'
        }}
      >
        {details ? 'Edit Applicant Personal Details' : 'Add Applicant Personal Details'}
        <IconButton aria-label="close" onClick={onClose} sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ padding: '24px', backgroundColor: '#f9f9f9' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="aadharCard"
                  name="aadharCard"
                  label="Aadhar Card"
                  value={formik.values.aadharCard}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters
                    if (value.length > 12) value = value.slice(0, 12); // Limit to 12 digits (Aadhar card length)

                    // Insert space every 4 digits
                    const formattedValue = value.replace(/(\d{4})(\d{4})(\d{4})?/, (match, p1, p2, p3) => {
                      let result = `${p1} ${p2}`;
                      if (p3) result += ` ${p3}`;
                      return result;
                    });

                    formik.setFieldValue('aadharCard', formattedValue);
                  }}
                  error={formik.touched.aadharCard && Boolean(formik.errors.aadharCard)}
                  helperText={formik.touched.aadharCard && formik.errors.aadharCard}
                  inputProps={{ maxLength: 14 }} // 12 digits + 2 spaces = 14 characters
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="pancard"
                  name="pancard"
                  label="Pancard"
                  value={formik.values.pancard}
                  onChange={formik.handleChange}
                  error={formik.touched.pancard && Boolean(formik.errors.pancard)}
                  helperText={formik.touched.pancard && formik.errors.pancard}
                  inputProps={{ maxLength: 10 }}

                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Date of Birth"
                  value={formik.values.dateOfBirth}
                  onChange={(value) => {
                    formik.setFieldValue('dateOfBirth', value);
                    if (value) {
                      const age = calculateAge(value);
                      formik.setFieldValue('ageOfClient', age);
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth),
                      helperText: formik.touched.dateOfBirth && formik.errors.dateOfBirth
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="ageOfClient"
                  name="ageOfClient"
                  label="Age of Client"
                  type="number"
                  value={formik.values.ageOfClient}
                  onChange={formik.handleChange}
                  error={formik.touched.ageOfClient && Boolean(formik.errors.ageOfClient)}
                  helperText={formik.touched.ageOfClient && formik.errors.ageOfClient}
                  disabled
                  inputProps={{ maxLength: 3 }}
                />
              </Grid>

              {/* Other form fields */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="fatherName"
                  name="fatherName"
                  label="Father's Name"
                  value={formik.values.fatherName}
                  onChange={formik.handleChange}
                  error={formik.touched.fatherName && Boolean(formik.errors.fatherName)}
                  helperText={formik.touched.fatherName && formik.errors.fatherName}
                  inputProps={{ maxLength: 15 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="motherName"
                  name="motherName"
                  label="Mother's Name"
                  value={formik.values.motherName}
                  onChange={formik.handleChange}
                  error={formik.touched.motherName && Boolean(formik.errors.motherName)}
                  helperText={formik.touched.motherName && formik.errors.motherName}
                  inputProps={{ maxLength: 15 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="wifeName"
                  name="wifeName"
                  label="Wife's Name"
                  value={formik.values.wifeName}
                  onChange={formik.handleChange}
                  error={formik.touched.wifeName && Boolean(formik.errors.wifeName)}
                  helperText={formik.touched.wifeName && formik.errors.wifeName}
                  inputProps={{ maxLength: 15 }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="reasonForFinancialDifficulty"
                  name="reasonForFinancialDifficulty"
                  label="Reason for Financial Difficulty"
                  value={formik.values.reasonForFinancialDifficulty}
                  onChange={formik.handleChange}
                  error={formik.touched.reasonForFinancialDifficulty && Boolean(formik.errors.reasonForFinancialDifficulty)}
                  helperText={formik.touched.reasonForFinancialDifficulty && formik.errors.reasonForFinancialDifficulty}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="numberOfChildren"
                  name="numberOfChildren"
                  label="Number of Children"
                  type="number"
                  value={formik.values.numberOfChildren}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 2) {
                      // Allow only up to 2 digits
                      formik.handleChange(e);
                    }
                  }}
                  error={formik.touched.numberOfChildren && Boolean(formik.errors.numberOfChildren)}
                  helperText={formik.touched.numberOfChildren && formik.errors.numberOfChildren}
                  inputProps={{ maxLength: 2, min: 0 }} // Ensure maxLength for consistency
                />
              </Grid>

              {/* Add more form inputs as needed */}
            </Grid>
          </LocalizationProvider>
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
            {details ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
