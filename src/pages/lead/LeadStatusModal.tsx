import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material'; // This is correct



interface LeadStatusModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

// Initialize SweetAlert with React content
const MySwal = withReactContent(Swal);

export default function LeadStatusModal({ open, onClose, onSave }: LeadStatusModalProps) {
  const [details, setDetails] = useState<any | null>(null);
  // Load details from local storage on component mount
  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem('leadStatusData') || 'null');
    if (savedDetails) {
      setDetails({
        ...savedDetails
      });
    }
  }, []);
  const [initialValues, setInitialValues] = useState({
    leadStatus: '',
    legalStatus: '',
    harassmentStatus: '',
    paymentStatus: '',
  });

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('leadStatusData');
    if (savedData) {
      setInitialValues(JSON.parse(savedData));
    }
  }, [open]);

  const validationSchema = Yup.object({
    leadStatus: Yup.string().required('Lead Status is required'),
    legalStatus: Yup.string().required('Legal Status is required'),
    harassmentStatus: Yup.string().required('Harassment Status is required'),
    paymentStatus: Yup.string().required('Payment Status is required'),
  });

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
          localStorage.setItem('leadStatusData', JSON.stringify(values));
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
        {initialValues.leadStatus ? 'Edit Lead Status' : 'Add Lead Status'}
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
            <Grid item xs={12}>
              {/* Lead Status Dropdown */}
              <TextField
                select
                fullWidth
                id="leadStatus"
                name="leadStatus"
                label="Lead Status"
                value={formik.values.leadStatus}
                onChange={formik.handleChange}
                error={formik.touched.leadStatus && Boolean(formik.errors.leadStatus)}
                helperText={formik.touched.leadStatus && formik.errors.leadStatus}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              {/* Legal Status Dropdown */}
              <TextField
                select
                fullWidth
                id="legalStatus"
                name="legalStatus"
                label="Legal Status"
                value={formik.values.legalStatus}
                onChange={formik.handleChange}
                error={formik.touched.legalStatus && Boolean(formik.errors.legalStatus)}
                helperText={formik.touched.legalStatus && formik.errors.legalStatus}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Under Review">Under Review</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              {/* Harassment Status Dropdown */}
              <TextField
                select
                fullWidth
                id="harassmentStatus"
                name="harassmentStatus"
                label="Harassment Status"
                value={formik.values.harassmentStatus}
                onChange={formik.handleChange}
                error={formik.touched.harassmentStatus && Boolean(formik.errors.harassmentStatus)}
                helperText={formik.touched.harassmentStatus && formik.errors.harassmentStatus}
              >
                <MenuItem value="Not Reported">Not Reported</MenuItem>
                <MenuItem value="Reported">Reported</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              {/* Payment Status Dropdown */}
              <TextField
                select
                fullWidth
                id="paymentStatus"
                name="paymentStatus"
                label="Payment Status"
                value={formik.values.paymentStatus}
                onChange={formik.handleChange}
                error={formik.touched.paymentStatus && Boolean(formik.errors.paymentStatus)}
                helperText={formik.touched.paymentStatus && formik.errors.paymentStatus}
              >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        {/* Enhanced Dialog Actions */}
        <DialogActions sx={{ padding: '16px' }}>
          <Button
            onClick={onClose}
            sx={{
              backgroundColor: '#e74c3c',
              color: '#fff',
              borderRadius: '24px',
              padding: '10px 24px',
              '&:hover': {
                backgroundColor: '#c0392b',
                color: '#fff',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            sx={{
              backgroundColor: '#3498db',
              color: '#fff',
              borderRadius: '24px',
              padding: '10px 24px',
              marginLeft: '8px',
              '&:hover': {
                backgroundColor: '#2980b9',
                color: '#fff',
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
