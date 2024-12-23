import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material'; // This is correct


// Initialize Swal with React content
const MySwal = withReactContent(Swal);

interface IncomeDetailsOfFirstApplicant {
  wagePerMonth: number | string;
  otherIncome: number | string;
  pensionPerMonth: number | string;
  totalIncome: number | string;
  incomeAsPerProof: string;
  incomeRatio: number | string;
  nextSalaryPaymentDate: Date | null;
  salaryAccount: string;
}

interface IncomeDetailsOfFirstApplicantModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: IncomeDetailsOfFirstApplicant) => void;
}

export default function IncomeDetailsOfFirstApplicantModal({ open, onClose, onSave }: IncomeDetailsOfFirstApplicantModalProps) {
  const [initialValues, setInitialValues] = useState<IncomeDetailsOfFirstApplicant>({
    wagePerMonth: '',
    otherIncome: '',
    pensionPerMonth: '',
    totalIncome: '',
    incomeAsPerProof: '',
    incomeRatio: '',
    nextSalaryPaymentDate: null,
    salaryAccount: ''
  });

  // Load details from local storage on component mount
  useEffect(() => {
    const savedDetails = localStorage.getItem('incomeDetailsOfFirstApplicant');
    if (savedDetails) {
      const parsedDetails = JSON.parse(savedDetails);
      parsedDetails.nextSalaryPaymentDate = new Date(parsedDetails.nextSalaryPaymentDate);
      setInitialValues(parsedDetails);
    }
  }, []);

  const validationSchema = Yup.object({
    wagePerMonth: Yup.number().typeError('Must be a number').required('Wage/Month is required'),
    otherIncome: Yup.number().typeError('Must be a number').required('Other Income is required'),
    pensionPerMonth: Yup.number().typeError('Must be a number').required('Pension/Month is required'),
    totalIncome: Yup.number().typeError('Must be a number').required('Total Income is required'),
    incomeAsPerProof: Yup.string().required('Income As Per Proof is required'),
    incomeRatio: Yup.number().typeError('Must be a number').required('Income Ratio % is required'),
    nextSalaryPaymentDate: Yup.date().nullable().required('Next salary payment date is required'),
    salaryAccount: Yup.string().required('Salary Account is required')
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
          localStorage.setItem('incomeDetailsOfFirstApplicant', JSON.stringify(values));
          onSave(values);
          Swal.fire('Saved!', 'Your data has been saved.', 'success');
          onClose();
        }
      });
    }
  });

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
          {initialValues ? 'Edit Income Details of First Applicant' : 'Add Income Details of First Applicant'}
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
              {/* Wage/Month */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="wagePerMonth"
                  name="wagePerMonth"
                  label="Wage/Month"
                  type="number"
                  value={formik.values.wagePerMonth}
                  onChange={formik.handleChange}
                  error={formik.touched.wagePerMonth && Boolean(formik.errors.wagePerMonth)}
                  helperText={formik.touched.wagePerMonth && formik.errors.wagePerMonth}
                />
              </Grid>
              {/* Other Income */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="otherIncome"
                  name="otherIncome"
                  label="Other Income"
                  type="number"
                  value={formik.values.otherIncome}
                  onChange={formik.handleChange}
                  error={formik.touched.otherIncome && Boolean(formik.errors.otherIncome)}
                  helperText={formik.touched.otherIncome && formik.errors.otherIncome}
                />
              </Grid>
              {/* Pension/Month */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="pensionPerMonth"
                  name="pensionPerMonth"
                  label="Pension/Month"
                  type="number"
                  value={formik.values.pensionPerMonth}
                  onChange={formik.handleChange}
                  error={formik.touched.pensionPerMonth && Boolean(formik.errors.pensionPerMonth)}
                  helperText={formik.touched.pensionPerMonth && formik.errors.pensionPerMonth}
                />
              </Grid>
              {/* Total Income */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="totalIncome"
                  name="totalIncome"
                  label="Total Income"
                  type="number"
                  value={formik.values.totalIncome}
                  onChange={formik.handleChange}
                  error={formik.touched.totalIncome && Boolean(formik.errors.totalIncome)}
                  helperText={formik.touched.totalIncome && formik.errors.totalIncome}
                />
              </Grid>
              {/* Income As Per Proof */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="incomeAsPerProof"
                  name="incomeAsPerProof"
                  label="Income As Per Proof"
                  value={formik.values.incomeAsPerProof}
                  onChange={formik.handleChange}
                  error={formik.touched.incomeAsPerProof && Boolean(formik.errors.incomeAsPerProof)}
                  helperText={formik.touched.incomeAsPerProof && formik.errors.incomeAsPerProof}
                />
              </Grid>
              {/* Income Ratio % */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="incomeRatio"
                  name="incomeRatio"
                  label="Income Ratio %"
                  type="number"
                  value={formik.values.incomeRatio}
                  onChange={formik.handleChange}
                  error={formik.touched.incomeRatio && Boolean(formik.errors.incomeRatio)}
                  helperText={formik.touched.incomeRatio && formik.errors.incomeRatio}
                />
              </Grid>
              {/* Next Salary Payment Date */}
              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Next Salary Payment Date"
                  value={formik.values.nextSalaryPaymentDate}
                  onChange={(newValue) => formik.setFieldValue('nextSalaryPaymentDate', newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              {/* Salary Account */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="salaryAccount"
                  name="salaryAccount"
                  label="Salary Account"
                  value={formik.values.salaryAccount}
                  onChange={formik.handleChange}
                  error={formik.touched.salaryAccount && Boolean(formik.errors.salaryAccount)}
                  helperText={formik.touched.salaryAccount && formik.errors.salaryAccount}
                />
              </Grid>
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
              {initialValues ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
}
