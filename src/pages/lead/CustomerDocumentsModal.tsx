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
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import CloseIcon from '@mui/icons-material/Close';

interface CustomerDocumentsModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: DocumentDetails) => void;
}

interface DocumentDetails {
  id: string;
  loanAgreementCopyName: string | null;
  creditFileCopyName: string | null;
  rentProofName: string | null;
  wageSlipsName: string | null;
}

export default function CustomerDocumentsModal({ open, onClose, onSave }: CustomerDocumentsModalProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [documents, setDocuments] = useState<DocumentDetails[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('customerDocuments');
    if (storedData) {
      setDocuments(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: DocumentDetails[]) => {
    localStorage.setItem('customerDocuments', JSON.stringify(newData));
    setDocuments(newData);
  };

  const validationSchema = Yup.object({
    loanAgreementCopyName: Yup.string().required('The copy of the loan agreements is required'),
    creditFileCopyName: Yup.string().required('Copy of credit file is required'),
    rentProofName: Yup.string().required('Proof of rent/housing loan is required'),
    wageSlipsName: Yup.string().required('Copy of wage slips and proof of other incomes is required'),
  });

  const formik = useFormik<DocumentDetails>({
    initialValues: {
      id: '',
      loanAgreementCopyName: null,
      creditFileCopyName: null,
      rentProofName: null,
      wageSlipsName: null,
    },
    validationSchema,
    onSubmit: (values) => {
      const updatedData = editingId
        ? documents.map((item) =>
            item.id === editingId ? { ...values, id: editingId } : item
          )
        : [...documents, { ...values, id: new Date().toISOString() }];

      handleSave(updatedData);
      formik.resetForm();
      setEditingId(null);
      setTabIndex(1); // Switch to view tab after saving
      onClose();
      Swal.fire({
        title: 'Success!',
        text: 'Customer document details have been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof DocumentDetails) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      formik.setFieldValue(fieldName, file.name);
    }
  };

  const handleEdit = (id: string) => {
    const item = documents.find((d) => d.id === id);
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
        const updatedData = documents.filter((item) => item.id !== id);
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
        Add/View Customer Documents
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
        <Tab label="Add Documents" />
        <Tab label="View Documents" />
      </Tabs>

      {tabIndex === 0 && (
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ padding: '24px', backgroundColor: '#f9f9f9' }}>
            <Grid container spacing={2}>
              {/* Loan Agreement */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="loanAgreementCopyName"
                  name="loanAgreementCopyName"
                  label="The Copy of the Loan Agreements"
                  value={formik.values.loanAgreementCopyName || ''}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <IconButton component="label">
                        <UploadFileIcon />
                        <input
                          type="file"
                          hidden
                          onChange={(e) => handleFileChange(e, 'loanAgreementCopyName')}
                        />
                      </IconButton>
                    ),
                  }}
                  error={formik.touched.loanAgreementCopyName && Boolean(formik.errors.loanAgreementCopyName)}
                  helperText={formik.touched.loanAgreementCopyName && formik.errors.loanAgreementCopyName}
                />
              </Grid>

              {/* Credit File */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="creditFileCopyName"
                  name="creditFileCopyName"
                  label="Copy of Credit File"
                  value={formik.values.creditFileCopyName || ''}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <IconButton component="label">
                        <UploadFileIcon />
                        <input
                          type="file"
                          hidden
                          onChange={(e) => handleFileChange(e, 'creditFileCopyName')}
                        />
                      </IconButton>
                    ),
                  }}
                  error={formik.touched.creditFileCopyName && Boolean(formik.errors.creditFileCopyName)}
                  helperText={formik.touched.creditFileCopyName && formik.errors.creditFileCopyName}
                />
              </Grid>

              {/* Rent Proof */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="rentProofName"
                  name="rentProofName"
                  label="Proof of Rent/Housing Loan"
                  value={formik.values.rentProofName || ''}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <IconButton component="label">
                        <UploadFileIcon />
                        <input
                          type="file"
                          hidden
                          onChange={(e) => handleFileChange(e, 'rentProofName')}
                        />
                      </IconButton>
                    ),
                  }}
                  error={formik.touched.rentProofName && Boolean(formik.errors.rentProofName)}
                  helperText={formik.touched.rentProofName && formik.errors.rentProofName}
                />
              </Grid>

              {/* Wage Slips */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="wageSlipsName"
                  name="wageSlipsName"
                  label="Copy of Wage Slips and Proof of Other Incomes"
                  value={formik.values.wageSlipsName || ''}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <IconButton component="label">
                        <UploadFileIcon />
                        <input
                          type="file"
                          hidden
                          onChange={(e) => handleFileChange(e, 'wageSlipsName')}
                        />
                      </IconButton>
                    ),
                  }}
                  error={formik.touched.wageSlipsName && Boolean(formik.errors.wageSlipsName)}
                  helperText={formik.touched.wageSlipsName && formik.errors.wageSlipsName}
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
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Loan Agreement Copy</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Credit File Copy</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Rent Proof</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Wage Slips</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{doc.loanAgreementCopyName || 'N/A'}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{doc.creditFileCopyName || 'N/A'}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{doc.rentProofName || 'N/A'}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{doc.wageSlipsName || 'N/A'}</TableCell>
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
