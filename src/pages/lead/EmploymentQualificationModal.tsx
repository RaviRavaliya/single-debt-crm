import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material'; // This is correct

interface EmploymentQualificationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const MySwal = withReactContent(Swal);

const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export default function EmploymentQualificationModal({ open, onClose, onSave }: EmploymentQualificationModalProps) {
  const [details, setDetails] = useState<any | null>(null);
  // Load details from local storage on component mount
  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem('employmentQualificationData') || 'null');
    if (savedDetails) {
      setDetails({
        ...savedDetails
      });
    }
  }, []);
  const [initialValues, setInitialValues] = useState({
    employmentStatus: '',
    officeStreet: '',
    officeState: '',
    officeCity: '',
    officePincode: '',
    employmentFirm: ''
  });

  useEffect(() => {
    const savedData = localStorage.getItem('employmentQualificationData');
    if (savedData) {
      setInitialValues(JSON.parse(savedData));
    }
  }, [open]);

  const validationSchema = Yup.object({
    employmentStatus: Yup.string().required('Employment Status is required'),
    officeStreet: Yup.string().required('Office Street is required'),
    officeState: Yup.string().required('Office State is required'),
    officeCity: Yup.string()
      .required('Office city is required')
      .matches(/^[A-Za-z ]*$/, ' Office city must be a string'),
    officePincode: Yup.number()
      .required('Pincode is required')
      .positive()
      .integer()
      .min(100000, 'Enter a valid pincode')
      .max(999999, 'Enter a valid pincode'),
    employmentFirm: Yup.string().required('Employment Firm is required')
  });

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onClose();
      MySwal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save these changes?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, save it!'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('employmentQualificationData', JSON.stringify(values));
          Swal.fire('Saved!', 'Your data has been saved.', 'success');
          onSave(values);
          onClose();
        }
      });
    }
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)', // Adding shadow for depth
          background: 'linear-gradient(135deg, #f7f7f7 30%, #e6f9ff 100%)' // Subtle background gradient
        }
      }}
    >
      {/* Styled Dialog Title */}
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
        {initialValues?.employmentStatus ? 'Edit Employment Qualification' : 'Add Employment Qualification'}
        <IconButton aria-label="close" onClick={onClose} sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ padding: '24px', backgroundColor: '#f9f9f9' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                id="employmentStatus"
                name="employmentStatus"
                label="Employment Status"
                value={formik.values.employmentStatus}
                onChange={formik.handleChange}
                error={formik.touched.employmentStatus && Boolean(formik.errors.employmentStatus)}
                helperText={formik.touched.employmentStatus && formik.errors.employmentStatus}
              >
                <MenuItem value="Salaried">Salaried</MenuItem>
                <MenuItem value="Self Employed Professional">Self Employed Professional</MenuItem>
                <MenuItem value="Self Employed Business">Self Employed Business</MenuItem>
                <MenuItem value="Pensioner">Pensioner</MenuItem>
                <MenuItem value="Self-Employed">Self-Employed</MenuItem>
                <MenuItem value="Retired">Retired</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="officeStreet"
                name="officeStreet"
                label="Office Street"
                value={formik.values.officeStreet}
                onChange={formik.handleChange}
                error={formik.touched.officeStreet && Boolean(formik.errors.officeStreet)}
                helperText={formik.touched.officeStreet && formik.errors.officeStreet}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                id="officeState"
                name="officeState"
                label="Office State"
                value={formik.values.officeState}
                onChange={formik.handleChange}
                error={formik.touched.officeState && Boolean(formik.errors.officeState)}
                helperText={formik.touched.officeState && formik.errors.officeState}
              >
                {indianStates.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="officeCity"
                name="officeCity"
                label="Office City"
                value={formik.values.officeCity}
                onChange={formik.handleChange}
                error={formik.touched.officeCity && Boolean(formik.errors.officeCity)}
                helperText={formik.touched.officeCity && formik.errors.officeCity}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="officePincode"
                name="officePincode"
                label="Office Pincode"
                type="number"
                value={formik.values.officePincode}
                onChange={formik.handleChange}
                error={formik.touched.officePincode && Boolean(formik.errors.officePincode)}
                helperText={formik.touched.officePincode && formik.errors.officePincode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="employmentFirm"
                name="employmentFirm"
                label="Employment Firm"
                value={formik.values.employmentFirm}
                onChange={formik.handleChange}
                error={formik.touched.employmentFirm && Boolean(formik.errors.employmentFirm)}
                helperText={formik.touched.employmentFirm && formik.errors.employmentFirm}
              />
            </Grid>
          </Grid>
        </DialogContent>

        {/* Enhanced Dialog Actions */}
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
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
