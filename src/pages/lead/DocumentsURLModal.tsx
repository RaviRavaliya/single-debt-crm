import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  IconButton,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';

interface DocumentsURLModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: DocumentsURLDetails) => void;
}

interface DocumentsURLDetails {
  id: string;
  singleDebtUSPLink: string;
  loeLink: string;
  referrerLink: string;
  leadActivityDetails: string;
}

export default function DocumentsURLModal({ open, onClose, onSave }: DocumentsURLModalProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [documentsURLs, setDocumentsURLs] = useState<DocumentsURLDetails[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('documentsURLs');
    if (storedData) {
      setDocumentsURLs(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: DocumentsURLDetails[]) => {
    localStorage.setItem('documentsURLs', JSON.stringify(newData));
    setDocumentsURLs(newData);
  };

  const validationSchema = Yup.object({
    singleDebtUSPLink: Yup.string().url('Enter a valid URL').required('SingleDebt USP Link is required'),
    loeLink: Yup.string().url('Enter a valid URL').required('LOE Link is required'),
    referrerLink: Yup.string().url('Enter a valid URL').required('Referrer Link is required'),
    leadActivityDetails: Yup.string().url('Enter a valid URL').required('Lead Activity Details are required'),
  });

  const formik = useFormik<DocumentsURLDetails>({
    initialValues: {
      id: '',
      singleDebtUSPLink: '',
      loeLink: '',
      referrerLink: '',
      leadActivityDetails: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const updatedData = editingId
        ? documentsURLs.map((item) =>
            item.id === editingId ? { ...values, id: editingId } : item
          )
        : [...documentsURLs, { ...values, id: new Date().toISOString() }];

      handleSave(updatedData);
      formik.resetForm();
      setEditingId(null);
      setTabIndex(1); // Switch to view tab after saving
      onClose();
      Swal.fire({
        title: 'Success!',
        text: 'Document URLs have been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    },
  });

  const handleEdit = (id: string) => {
    const item = documentsURLs.find((d) => d.id === id);
    if (item) {
      formik.setValues({
        ...item,
      });
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
        const updatedData = documentsURLs.filter((item) => item.id !== id);
        handleSave(updatedData);
        Swal.fire('Deleted!', 'Your entry has been deleted.', 'success');
      }
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{ style: { borderRadius: '16px', padding: '16px', maxHeight:"90vh" } }}
    >
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
        Add/View Documents URL
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
        <Tab label="Add URL" />
        <Tab label="View URLs" />
      </Tabs>

      {tabIndex === 0 && (
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="singleDebtUSPLink"
                  name="singleDebtUSPLink"
                  label="SingleDebt USP Link"
                  value={formik.values.singleDebtUSPLink}
                  onChange={formik.handleChange}
                  error={formik.touched.singleDebtUSPLink && Boolean(formik.errors.singleDebtUSPLink)}
                  helperText={formik.touched.singleDebtUSPLink && formik.errors.singleDebtUSPLink}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="loeLink"
                  name="loeLink"
                  label="LOE Link"
                  value={formik.values.loeLink}
                  onChange={formik.handleChange}
                  error={formik.touched.loeLink && Boolean(formik.errors.loeLink)}
                  helperText={formik.touched.loeLink && formik.errors.loeLink}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="referrerLink"
                  name="referrerLink"
                  label="Referrer Link"
                  value={formik.values.referrerLink}
                  onChange={formik.handleChange}
                  error={formik.touched.referrerLink && Boolean(formik.errors.referrerLink)}
                  helperText={formik.touched.referrerLink && formik.errors.referrerLink}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="leadActivityDetails"
                  name="leadActivityDetails"
                  label="Lead Activity Details Link"
                  value={formik.values.leadActivityDetails}
                  onChange={formik.handleChange}
                  error={formik.touched.leadActivityDetails && Boolean(formik.errors.leadActivityDetails)}
                  helperText={formik.touched.leadActivityDetails && formik.errors.leadActivityDetails}
                />
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
              Save
            </Button>
          </DialogActions>
        </form>
      )}

      {tabIndex === 1 && (
        <DialogContent>
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table sx={{ minWidth: 800 }} stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>SingleDebt USP Link</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>LOE Link</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Referrer Link</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Lead Activity Details Link</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documentsURLs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{doc.singleDebtUSPLink}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{doc.loeLink}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{doc.referrerLink}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{doc.leadActivityDetails}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <IconButton onClick={() => handleEdit(doc.id)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(doc.id)} color="error">
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
