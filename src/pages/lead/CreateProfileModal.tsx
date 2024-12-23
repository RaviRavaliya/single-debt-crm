import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

interface CreateProfileModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function CreateProfileModal({ open, onClose, onSave }: CreateProfileModalProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [profileImageURL, setProfileImageURL] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('creditorProfiles');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: any[]) => {
    localStorage.setItem('creditorProfiles', JSON.stringify(newData));
    setData(newData);
  };

  const validationSchema = Yup.object({
    creditorsProfileName: Yup.string().required('Profile Name is required'),
    ownerEmail: Yup.string().email('Invalid email').required('Owner Email is required'),
    creditorsProfileOwner: Yup.string().required('Profile Owner is required'),
    bankType: Yup.string().required('Bank Type is required'),
    mobileNo1: Yup.string().required('Mobile No1 is required'),
    gstNumber: Yup.string().required('GST Number is required'),
    city: Yup.string().required('City is required'),
    zipCode: Yup.string().required('Zip Code is required'),
  });

  const formik = useFormik({
    initialValues: {
      updateVendorIds: '',
      creditorsProfileName: '',
      ownerEmail: '',
      creditorsProfileOwner: '',
      bankType: '',
      email1: '',
      email2: '',
      email3: '',
      email4: '',
      mobileNo1: '',
      mobileNo2: '',
      mobileNo3: '',
      mobileNo4: '',
      emailOptOut: false,
      phoneNo: '',
      oldRecordId: '',
      legalEntity: '',
      leads: '',
      gstNumber: '',
      street: '',
      city: '',
      states: '',
      state: '',
      zipCode: '',
      country: '',
      actionToBeTaken: '',
      singleLine1: '',
      singleLine2: '',
      singleLine3: '',
      singleLine4: '',
      zbooksVendorId: '',
      profileImage: '', // Profile Image field
    },
    validationSchema,
    onSubmit: (values) => {
      const updatedData = editingId
        ? data.map((item) => (item.id === editingId ? { ...values, id: editingId } : item))
        : [...data, { ...values, id: new Date().toISOString() }];

      handleSave(updatedData);
      formik.resetForm();
      setEditingId(null);
      setTabIndex(1);
      onClose();
      onSave(values);
      Swal.fire({
        title: 'Success!',
        text: 'Profile details have been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'profileImage') {
          setProfileImageURL(reader.result as string);
        }
        formik.setFieldValue(field, file.name);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleEdit = (id: string) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      formik.setValues(item);
      setProfileImageURL(item.profileImage); // Load the stored image if available
      setEditingId(id);
      setTabIndex(0);
    }
  };

  const handleDelete = (id: string) => {
    onClose()
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this entry!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedData = data.filter((item) => item.id !== id);
        handleSave(updatedData);
        Swal.fire('Deleted!', 'Your entry has been deleted.', 'success');
      }
    });
  };

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
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
        Add/Edit Creditor Profile Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
        <Tab label="Add/Edit Profile Details" />
        <Tab label="View Profile Details" />
      </Tabs>
      {tabIndex === 0 && (
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
            <Typography variant="h4" gutterBottom>
              Creditor's Profile Information
            </Typography>
            <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="creditorsProfileName"
                  name="creditorsProfileName"
                  label="Creditors Profile Name"
                  value={formik.values.creditorsProfileName}
                  onChange={formik.handleChange}
                  error={formik.touched.creditorsProfileName && Boolean(formik.errors.creditorsProfileName)}
                  helperText={formik.touched.creditorsProfileName && formik.errors.creditorsProfileName}
                />
              </Grid>
              {/* Image Upload Field */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="profileImage"
                  name="profileImage"
                  label="Upload Profile Image"
                  value={formik.values.profileImage || ''}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <IconButton component="label">
                        <UploadFileIcon />
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'profileImage')}
                        />
                      </IconButton>
                    ),
                  }}
                  error={formik.touched.profileImage && Boolean(formik.errors.profileImage)}
                  helperText={formik.touched.profileImage && formik.errors.profileImage}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="updateVendorIds"
                  name="updateVendorIds"
                  label="Update Vendor Ids"
                  value={formik.values.updateVendorIds}
                  onChange={formik.handleChange}
                />
              </Grid>
          
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="ownerEmail"
                  name="ownerEmail"
                  label="Owner Email"
                  value={formik.values.ownerEmail}
                  onChange={formik.handleChange}
                  error={formik.touched.ownerEmail && Boolean(formik.errors.ownerEmail)}
                  helperText={formik.touched.ownerEmail && formik.errors.ownerEmail}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="creditorsProfileOwner"
                  name="creditorsProfileOwner"
                  label="Creditors Profile Owner"
                  value={formik.values.creditorsProfileOwner}
                  onChange={formik.handleChange}
                  error={formik.touched.creditorsProfileOwner && Boolean(formik.errors.creditorsProfileOwner)}
                  helperText={formik.touched.creditorsProfileOwner && formik.errors.creditorsProfileOwner}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="bankType"
                  name="bankType"
                  label="Bank Type"
                  value={formik.values.bankType}
                  onChange={formik.handleChange}
                  error={formik.touched.bankType && Boolean(formik.errors.bankType)}
                  helperText={formik.touched.bankType && formik.errors.bankType}
                />
              </Grid>

           
              {/* Other Fields */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="email1"
                  name="email1"
                  label="Email 1"
                  value={formik.values.email1}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="email2"
                  name="email2"
                  label="Email 2"
                  value={formik.values.email2}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="email3"
                  name="email3"
                  label="Email 3"
                  value={formik.values.email3}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="email4"
                  name="email4"
                  label="Email 4"
                  value={formik.values.email4}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="mobileNo1"
                  name="mobileNo1"
                  label="Mobile No1"
                  value={formik.values.mobileNo1}
                  onChange={formik.handleChange}
                  error={formik.touched.mobileNo1 && Boolean(formik.errors.mobileNo1)}
                  helperText={formik.touched.mobileNo1 && formik.errors.mobileNo1}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="mobileNo2"
                  name="mobileNo2"
                  label="Mobile No2"
                  value={formik.values.mobileNo2}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="mobileNo3"
                  name="mobileNo3"
                  label="Mobile No3"
                  value={formik.values.mobileNo3}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="mobileNo4"
                  name="mobileNo4"
                  label="Mobile No4"
                  value={formik.values.mobileNo4}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="phoneNo"
                  name="phoneNo"
                  label="Phone No"
                  value={formik.values.phoneNo}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="oldRecordId"
                  name="oldRecordId"
                  label="Old Record Id"
                  value={formik.values.oldRecordId}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="legalEntity"
                  name="legalEntity"
                  label="Legal Entity"
                  value={formik.values.legalEntity}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="leads"
                  name="leads"
                  label="Leads"
                  value={formik.values.leads}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>

            {/* Address Information */}
            <Typography variant="h4" gutterBottom sx={{ marginTop: '24px' }}>
              Address Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="gstNumber"
                  name="gstNumber"
                  label="GST Number"
                  value={formik.values.gstNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.gstNumber && Boolean(formik.errors.gstNumber)}
                  helperText={formik.touched.gstNumber && formik.errors.gstNumber}
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
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="states"
                  name="states"
                  label="States"
                  value={formik.values.states}
                  onChange={formik.handleChange}
                />
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="state"
                  name="state"
                  label="State"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                />
              </Grid> */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="zipCode"
                  name="zipCode"
                  label="Zip Code"
                  value={formik.values.zipCode}
                  onChange={formik.handleChange}
                  error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                  helperText={formik.touched.zipCode && formik.errors.zipCode}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="country"
                  name="country"
                  label="Country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>

            {/* Additional Information */}
            <Typography variant="h4" gutterBottom sx={{ marginTop: '24px' }}>
              Additional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="actionToBeTaken"
                  name="actionToBeTaken"
                  label="Action to be Taken"
                  value={formik.values.actionToBeTaken}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="singleLine1"
                  name="singleLine1"
                  label="Single Line 1"
                  value={formik.values.singleLine1}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="singleLine2"
                  name="singleLine2"
                  label="Single Line 2"
                  value={formik.values.singleLine2}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="singleLine3"
                  name="singleLine3"
                  label="Single Line 3"
                  value={formik.values.singleLine3}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="singleLine4"
                  name="singleLine4"
                  label="Single Line 4"
                  value={formik.values.singleLine4}
                  onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="zbooksVendorId"
                  name="zbooksVendorId"
                  label="Zbooks Vendor ID"
                  value={formik.values.zbooksVendorId}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
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
      )}
      {tabIndex === 1 && (
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Profile Name</TableCell>
                  <TableCell>Owner Email</TableCell>
                  <TableCell>Mobile No1</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.creditorsProfileName}</TableCell>
                    <TableCell>{item.ownerEmail}</TableCell>
                    <TableCell>{item.mobileNo1}</TableCell>
                    <TableCell>{item.city}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(item.id)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      )}
    </Dialog>
  );
}
