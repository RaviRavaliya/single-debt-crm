import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  MenuItem
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material'; // This is correct


interface FirstApplicantAddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;

}

interface ApplicantAddress {
  flatNo: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  accommodationStatus: string;
  timeAtAddress: string;
  educationStatus: string;
}

const statesOfIndia = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal'
];

const MySwal = withReactContent(Swal);

export default function FirstApplicantAddressModal({ open, onClose,onSave }: FirstApplicantAddressModalProps) {
  const [details, setDetails] = useState<any | null>(null);
  // Load details from local storage on component mount
  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem('applicantAddress') || 'null');
    if (savedDetails) {
      setDetails({
        ...savedDetails
      });
    }
  }, []);

  const [initialData, setInitialData] = useState<ApplicantAddress | null>(null);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('applicantAddress') || 'null');
    setInitialData(savedData);
  }, [open]);

  const validationSchema = Yup.object({
    flatNo: Yup.string().required('Flat No/Building Name is required'),
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required').matches(/^[A-Za-z ]*$/, 'City must be a string'),
    state: Yup.string().required('State is required'),
    pincode: Yup.number().required('Pincode is required').positive().integer().min(100000, 'Enter a valid pincode').max(999999, 'Enter a valid pincode'),
    accommodationStatus: Yup.string().required('Accommodation Status is required'),
    timeAtAddress: Yup.string().required('Time at Address is required'),
    educationStatus: Yup.string().required('Education Status is required')
  });

  const formik = useFormik({
    initialValues: initialData || {
      flatNo: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      accommodationStatus: '',
      timeAtAddress: '',
      educationStatus: ''
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onClose()
      MySwal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save this information?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, save it!',
        cancelButtonText: 'No, cancel!',
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('applicantAddress', JSON.stringify(values));
          setDetails(values);
          onClose();
          onSave(values)
          MySwal.fire('Saved!', 'Applicant Address has been saved.', 'success');
        }
      });
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
            alignItems: 'center',
          }}
      >
        {initialData ? 'Edit Applicant Address' : 'Add Applicant Address'}
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
                id="flatNo"
                name="flatNo"
                label="Flat No/Building Name"
                value={formik.values.flatNo}
                onChange={formik.handleChange}
                error={formik.touched.flatNo && Boolean(formik.errors.flatNo)}
                helperText={formik.touched.flatNo && formik.errors.flatNo}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="street"
                name="street"
                label="Street"
                value={formik.values.street}
                onChange={formik.handleChange}
                error={formik.touched.street && Boolean(formik.errors.street)}
                helperText={formik.touched.street && formik.errors.street}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="city"
                name="city"
                label="City"
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
                inputProps={{ maxLength: 15 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                id="state"
                name="state"
                label="State"
                value={formik.values.state}
                onChange={formik.handleChange}
                error={formik.touched.state && Boolean(formik.errors.state)}
                helperText={formik.touched.state && formik.errors.state}
              >
                {statesOfIndia.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="pincode"
                name="pincode"
                label="Pincode"
                type="number"
                value={formik.values.pincode}
                onChange={formik.handleChange}
                error={formik.touched.pincode && Boolean(formik.errors.pincode)}
                helperText={formik.touched.pincode && formik.errors.pincode}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                id="accommodationStatus"
                name="accommodationStatus"
                label="Accommodation Status"
                value={formik.values.accommodationStatus}
                onChange={formik.handleChange}
                error={formik.touched.accommodationStatus && Boolean(formik.errors.accommodationStatus)}
                helperText={formik.touched.accommodationStatus && formik.errors.accommodationStatus}
              >
                <MenuItem value="Home Owner">Home Owner</MenuItem>
                <MenuItem value="Tenant - Private Landlord">Tenant - Private Landlord</MenuItem>
                <MenuItem value="Tenant - Employer Landlord">Tenant - Employer Landlord</MenuItem>
                <MenuItem value="Living with parents">Living with parents</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                id="timeAtAddress"
                name="timeAtAddress"
                label="How long at this address"
                value={formik.values.timeAtAddress}
                onChange={formik.handleChange}
                error={formik.touched.timeAtAddress && Boolean(formik.errors.timeAtAddress)}
                helperText={formik.touched.timeAtAddress && formik.errors.timeAtAddress}
              >
                <MenuItem value="< 1 year">Less than 1 year</MenuItem>
                <MenuItem value="1 - 2 years">1 - 2 years</MenuItem>
                <MenuItem value="> 3 years">More than 3 years</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                id="educationStatus"
                name="educationStatus"
                label="Education Status"
                value={formik.values.educationStatus}
                onChange={formik.handleChange}
                error={formik.touched.educationStatus && Boolean(formik.errors.educationStatus)}
                helperText={formik.touched.educationStatus && formik.errors.educationStatus}
              >
                <MenuItem value="Post Graduate">Post Graduate</MenuItem>
                <MenuItem value="Graduate">Graduate</MenuItem>
                <MenuItem value="Higher Secondary">Higher Secondary</MenuItem>
                <MenuItem value="Secondary">Secondary</MenuItem>
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
                backgroundColor: '#2980b9',
              }
            }}
          >
          {details ? "Update" :"Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
