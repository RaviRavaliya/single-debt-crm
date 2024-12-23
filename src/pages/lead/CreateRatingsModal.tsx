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

interface CreateRatingsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function CreateRatingsModal({ open, onClose, onSave }: CreateRatingsModalProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [profileImageURL, setProfileImageURL] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('ratings');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: any[]) => {
    localStorage.setItem('ratings', JSON.stringify(newData));
    setData(newData);
  };

  const validationSchema = Yup.object({
    leadName: Yup.string().required('Lead Name is required'),
    reviewComment: Yup.string().required('Review Comment is required'),
    leadId: Yup.string().required('Lead ID is required'),
    ratings: Yup.string().required('Ratings is required'),
    oldRecordId: Yup.string().required('Old Record ID is required'),
    ownerEmail: Yup.string().email('Invalid email').required('Owner Email is required'),
    ratingsOwner: Yup.string().required('Ratings Owner is required'),
    ratingFrom: Yup.string().required('Rating From is required'),
    callName: Yup.string().required('Call Name is required'),
    callId: Yup.string().required('Call ID is required'),
  });

  const formik = useFormik({
    initialValues: {
      leadName: '',
      reviewComment: '',
      leadId: '',
      ratings: '',
      oldRecordId: '',
      ownerEmail: '',
      ratingsOwner: '',
      ratingFrom: '',
      callName: '',
      callId: '',
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
        text: 'Ratings details have been saved successfully.',
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
    onClose();
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
        Add/Edit Ratings Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
        <Tab label="Add/Edit Ratings Details" />
        <Tab label="View Ratings Details" />
      </Tabs>
      {tabIndex === 0 && (
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
            <Typography variant="h4" gutterBottom>
              Ratings Information
            </Typography>
            <Grid container spacing={2}>
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
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="reviewComment"
                  name="reviewComment"
                  label="Review Comment"
                  value={formik.values.reviewComment}
                  onChange={formik.handleChange}
                  error={formik.touched.reviewComment && Boolean(formik.errors.reviewComment)}
                  helperText={formik.touched.reviewComment && formik.errors.reviewComment}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="leadId"
                  name="leadId"
                  label="Lead ID"
                  value={formik.values.leadId}
                  onChange={formik.handleChange}
                  error={formik.touched.leadId && Boolean(formik.errors.leadId)}
                  helperText={formik.touched.leadId && formik.errors.leadId}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="ratings"
                  name="ratings"
                  label="Ratings"
                  value={formik.values.ratings}
                  onChange={formik.handleChange}
                  error={formik.touched.ratings && Boolean(formik.errors.ratings)}
                  helperText={formik.touched.ratings && formik.errors.ratings}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="oldRecordId"
                  name="oldRecordId"
                  label="Old Record ID"
                  value={formik.values.oldRecordId}
                  onChange={formik.handleChange}
                  error={formik.touched.oldRecordId && Boolean(formik.errors.oldRecordId)}
                  helperText={formik.touched.oldRecordId && formik.errors.oldRecordId}
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
                  id="ratingsOwner"
                  name="ratingsOwner"
                  label="Ratings Owner"
                  value={formik.values.ratingsOwner}
                  onChange={formik.handleChange}
                  error={formik.touched.ratingsOwner && Boolean(formik.errors.ratingsOwner)}
                  helperText={formik.touched.ratingsOwner && formik.errors.ratingsOwner}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="ratingFrom"
                  name="ratingFrom"
                  label="Rating From"
                  value={formik.values.ratingFrom}
                  onChange={formik.handleChange}
                  error={formik.touched.ratingFrom && Boolean(formik.errors.ratingFrom)}
                  helperText={formik.touched.ratingFrom && formik.errors.ratingFrom}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="callName"
                  name="callName"
                  label="Call Name"
                  value={formik.values.callName}
                  onChange={formik.handleChange}
                  error={formik.touched.callName && Boolean(formik.errors.callName)}
                  helperText={formik.touched.callName && formik.errors.callName}
                />
              </Grid>
              <Grid item xs={12 } md={6}>
                <TextField
                  fullWidth
                  id="callId"
                  name="callId"
                  label="Call ID"
                  value={formik.values.callId}
                  onChange={formik.handleChange}
                  error={formik.touched.callId && Boolean(formik.errors.callId)}
                  helperText={formik.touched.callId && formik.errors.callId}
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
                  <TableCell>Lead Name</TableCell>
                  <TableCell>Review Comment</TableCell>
                  <TableCell>Lead ID</TableCell>
                  <TableCell>Ratings</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.leadName}</TableCell>
                    <TableCell>{item.reviewComment}</TableCell>
                    <TableCell>{item.leadId}</TableCell>
                    <TableCell>{item.ratings}</TableCell>
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