import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material'; // This is correct


// Initialize Swal with React content
const MySwal = withReactContent(Swal);

interface MonthlyExpenditure {
  utilities: string | number;
  medicalFees: string | number;
  homeLoan: string | number;
  rent: string | number;
  educationFees: string | number;
  otherLifeMedicalPolicies: string | number;
  pension: string | number;
  commuteToWorkCost: string | number;
  emi: string | number;
  telephone: string | number;
  mobileInternet: string | number;
  totalRepairMaintenance: string | number;
  housekeepingFoodMaid: string | number;
  totalCostForRunningCarBike: string | number;
  otherSecureLoan: string | number;
  others: string | number;
  totalExperience: string | number;
}

interface MonthlyExpenditureModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: MonthlyExpenditure) => void;
}

export default function MonthlyExpenditureModal({ open, onClose, onSave }: MonthlyExpenditureModalProps) {
  const defaultValues: MonthlyExpenditure = {
    utilities: '',
    medicalFees: '',
    homeLoan: '',
    rent: '',
    educationFees: '',
    otherLifeMedicalPolicies: '',
    pension: '',
    commuteToWorkCost: '',
    emi: '',
    telephone: '',
    mobileInternet: '',
    totalRepairMaintenance: '',
    housekeepingFoodMaid: '',
    totalCostForRunningCarBike: '',
    otherSecureLoan: '',
    others: '',
    totalExperience: ''
  };

  const [initialValues, setInitialValues] = useState<MonthlyExpenditure>(defaultValues);

  useEffect(() => {
    const savedDetails = localStorage.getItem('monthlyExpenditure');
    if (savedDetails) {
      const parsedDetails = JSON.parse(savedDetails);
      setInitialValues({ ...defaultValues, ...parsedDetails });
    }
  }, []);

  const validationSchema = Yup.object({
    utilities: Yup.number().typeError('Must be a number').required('Utilities is required'),
    medicalFees: Yup.number().typeError('Must be a number').required('Medical Fees is required'),
    homeLoan: Yup.number().typeError('Must be a number').required('Home Loan is required'),
    rent: Yup.number().typeError('Must be a number').required('Rent is required'),
    educationFees: Yup.number().typeError('Must be a number').required('Education Fees is required'),
    otherLifeMedicalPolicies: Yup.number().typeError('Must be a number').required('Other Life/Medical Policies is required'),
    pension: Yup.number().typeError('Must be a number').required('Pension is required'),
    commuteToWorkCost: Yup.number().typeError('Must be a number').required('Commute to work cost is required'),
    emi: Yup.number().typeError('Must be a number').required('EMI is required'),
    telephone: Yup.number().typeError('Must be a number').required('Telephone is required'),
    mobileInternet: Yup.number().typeError('Must be a number').required('Mobile/Internet is required'),
    totalRepairMaintenance: Yup.number().typeError('Must be a number').required('Total Repair/Maintenance is required'),
    housekeepingFoodMaid: Yup.number().typeError('Must be a number').required('Housekeeping Food/Maid is required'),
    totalCostForRunningCarBike: Yup.number().typeError('Must be a number').required('Total cost for running Car/Bike is required'),
    otherSecureLoan: Yup.number().typeError('Must be a number').required('Other Secure Loan is required'),
    others: Yup.number().typeError('Must be a number').required('Others is required'),
    totalExperience: Yup.number().typeError('Must be a number').required('Total Experience is required')
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // Allow the form to update with initialValues changes
    validationSchema,
    onSubmit: (values) => {
      onClose()
      MySwal.fire({
        title: 'Are you sure?',
        text: 'Do you want to save this data?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, save it!'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('monthlyExpenditure', JSON.stringify(values));
          onSave(values);
          Swal.fire('Saved!', 'Your data has been saved.', 'success');
          onClose();
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
        {formik.values ? 'Edit Monthly Expenditure' : 'Add Monthly Expenditure'}
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
            {Object.keys(defaultValues).map((field) => (
              <Grid item xs={12} md={6} key={field}>
                <TextField
                  fullWidth
                  id={field}
                  name={field}
                  label={field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  type="number"
                  value={formik.values[field as keyof MonthlyExpenditure]}
                  onChange={formik.handleChange}
                  error={formik.touched[field as keyof MonthlyExpenditure] && Boolean(formik.errors[field as keyof MonthlyExpenditure])}
                  helperText={formik.touched[field as keyof MonthlyExpenditure] && formik.errors[field as keyof MonthlyExpenditure]}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: '16px' }}>
          <Button
            onClick={onClose}
            sx={{
              backgroundColor: '#e74c3c',
              color: '#fff',
              '&:hover': { backgroundColor: '#c0392b', color: '#fff' }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            sx={{
              backgroundColor: '#3498db',
              color: '#fff',
              marginLeft: '8px',
              '&:hover': { backgroundColor: '#2980b9', color: '#fff' }
            }}
          >
            {formik.values ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
