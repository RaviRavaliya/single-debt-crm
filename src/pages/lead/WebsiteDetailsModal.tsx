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


interface WebsiteDetailsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

// Initialize SweetAlert with React content
const MySwal = withReactContent(Swal);

export default function WebsiteDetailsModal({
  open,
  onClose,
  onSave,
}: WebsiteDetailsModalProps) {
  const [details, setDetails] = useState<any | null>(null);
  // Load details from local storage on component mount
  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem('websiteDetailsData') || 'null');
    if (savedDetails) {
      setDetails({
        ...savedDetails
      });
    }
  }, []);

  const [initialValues, setInitialValues] = useState({
    outstandingAmount: '',
    noOfLoans: '',
    missedPayment: 'No',
    source: '',
    experiencingHarassment: 'No',
  });

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('websiteDetailsData');
    if (savedData) {
      setInitialValues(JSON.parse(savedData));
    }
  }, [open]);

// Validation schema
const validationSchema = Yup.object({
  outstandingAmount: Yup.number()
    .required('Outstanding Amount is required')
    .positive('Outstanding Amount must be a positive number'), // Ensure it's positive
  noOfLoans: Yup.number()
    .required('No Of Loans is required')
    .min(1, 'At least 1 loan is required') // Minimum of 1 loan
    .max(10, 'A maximum of 10 loans is allowed'), // Limit the number of loans (you can adjust this)
  missedPayment: Yup.string().required('Missed Payment is required'),
  source: Yup.string().required('Source is required'),
  experiencingHarassment: Yup.string().required('Experiencing Harassment is required'),
});
  const sources = ['Website', 'Referral', 'Social Media', 'Other'];

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
          localStorage.setItem('websiteDetailsData', JSON.stringify(values));
          setDetails(values);
          Swal.fire('Saved!', 'Your data has been saved.', 'success');
          onSave(values);
          onClose();
        }
      });
    },
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
          alignItems: 'center',
        }}
      >
        {initialValues?.outstandingAmount ? 'Edit Website Details' : 'Add Website Details'}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="outstandingAmount"
                name="outstandingAmount"
                label="Outstanding Amount (₹)"
                type="number"
                value={formik.values.outstandingAmount}
                onChange={formik.handleChange}
                error={formik.touched.outstandingAmount && Boolean(formik.errors.outstandingAmount)}
                helperText={
                  formik.touched.outstandingAmount && typeof formik.errors.outstandingAmount === 'string'
                    ? formik.errors.outstandingAmount
                    : undefined
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="noOfLoans"
                name="noOfLoans"
                label="No Of Loans"
                type="number"
                value={formik.values.noOfLoans}
                onChange={formik.handleChange}
                error={formik.touched.noOfLoans && Boolean(formik.errors.noOfLoans)}
                helperText={
                  formik.touched.noOfLoans && typeof formik.errors.noOfLoans === 'string'
                    ? formik.errors.noOfLoans
                    : undefined
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="missedPayment"
                name="missedPayment"
                label="Missed Payment"
                select
                value={formik.values.missedPayment}
                onChange={formik.handleChange}
                error={formik.touched.missedPayment && Boolean(formik.errors.missedPayment)}
                helperText={
                  formik.touched.missedPayment && typeof formik.errors.missedPayment === 'string'
                    ? formik.errors.missedPayment
                    : undefined
                }
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="source"
                name="source"
                label="Source"
                select
                value={formik.values.source}
                onChange={formik.handleChange}
                error={formik.touched.source && Boolean(formik.errors.source)}
                helperText={
                  formik.touched.source && typeof formik.errors.source === 'string'
                    ? formik.errors.source
                    : undefined
                }
              >
                {sources.map((source) => (
                  <MenuItem key={source} value={source}>
                    {source}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="experiencingHarassment"
                name="experiencingHarassment"
                label="Experiencing Harassment"
                select
                value={formik.values.experiencingHarassment}
                onChange={formik.handleChange}
                error={formik.touched.experiencingHarassment && Boolean(formik.errors.experiencingHarassment)}
                helperText={
                  formik.touched.experiencingHarassment && typeof formik.errors.experiencingHarassment === 'string'
                    ? formik.errors.experiencingHarassment
                    : undefined
                }
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
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
