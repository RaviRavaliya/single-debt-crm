import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Tabs,
  Tab,
  Typography,
  MenuItem,
  Switch,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function CreateTaskModal({ open, onClose, onSave }: CreateTaskModalProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('taskProfiles');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  const handleSave = (newData: any[]) => {
    localStorage.setItem('taskProfiles', JSON.stringify(newData));
    setData(newData);
  };

  const validationSchema = Yup.object({
    taskOwner: Yup.string().required('Task Owner is required').typeError('Task Owner must be a string'),
    subject: Yup.string().required('Subject is required').typeError('Subject must be a string'),
    dueDate: Yup.string().required('Due Date is required').typeError('Due Date must be a string'),
    status: Yup.string().required('Status is required').typeError('Status must be a string'),
    priority: Yup.string().required('Priority is required').typeError('Priority must be a string'),
    billNumber: Yup.number().required('Bill Number is required').typeError('Bill Number must be a number'),
    ownerEmail1: Yup.string().email('Invalid email format').required('Owner Email1 is required').typeError('Owner Email must be a string'),
    description: Yup.string().required('Description is required').typeError('Description must be a string'),
  });

  const formik = useFormik({
    initialValues: {
      taskOwner: 'Marketing Team',
      subject: '',
      dueDate: '',
      contact: '',
      deal: '',
      status: 'Not Started',
      priority: 'High',
      repeat: false,
      billNumber: '',
      ownerEmail1: '',
      reminder: false,
      oldRecordId1: '',
      description: '',
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
      Swal.fire({
        title: 'Success!',
        text: 'Task details have been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    },
  });

  const handleEdit = (id: string) => {
    const item = data.find((d) => d.id === id);
    if (item) {
      formik.setValues(item);
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
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedData = data.filter((item) => item.id !== id);
        handleSave(updatedData);
      }
    });
  };
  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={onClose}
      PaperProps={{ style: { borderRadius: '16px', padding: '16px', maxHeight: '90vh' } }}
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
        Add/Edit Task Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: '#fff', '&:hover': { backgroundColor: '#e74c3c' } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} centered>
        <Tab label="Add/Edit Task Details" />
        <Tab label="View Task Details" />
      </Tabs>

      {tabIndex === 0 && (
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ padding: '24px', backgroundColor: '#f7f7f7' }}>
            {/* Task Information */}
            <Typography variant="h4" gutterBottom>
              Task Information
            </Typography>
            <Grid container spacing={2}>
              {/* Task Owner */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  id="taskOwner"
                  name="taskOwner"
                  label="Task Owner"
                  value={formik.values.taskOwner}
                  onChange={formik.handleChange}
                  error={formik.touched.taskOwner && Boolean(formik.errors.taskOwner)}
                  helperText={formik.touched.taskOwner && formik.errors.taskOwner}
                >
                  <MenuItem value="Marketing Team">Marketing Team</MenuItem>
                  <MenuItem value="Sales Team">Sales Team</MenuItem>
                  <MenuItem value="Development Team">Development Team</MenuItem>
                  <MenuItem value="HR Team">HR Team</MenuItem>
                </TextField>
              </Grid>

              {/* Subject */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="subject"
                  name="subject"
                  label="Subject"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  error={formik.touched.subject && Boolean(formik.errors.subject)}
                  helperText={formik.touched.subject && formik.errors.subject}
                />
              </Grid>

              {/* Due Date */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="dueDate"
                  name="dueDate"
                  label="Due Date"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={formik.values.dueDate}
                  onChange={formik.handleChange}
                  error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                  helperText={formik.touched.dueDate && formik.errors.dueDate}
                />
              </Grid>

              {/* Contact */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="contact"
                  name="contact"
                  label="Contact"
                  value={formik.values.contact}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* Deal */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="deal"
                  name="deal"
                  label="Deal"
                  value={formik.values.deal}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  id="status"
                  name="status"
                  label="Status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  helperText={formik.touched.status && formik.errors.status}
                >
                  <MenuItem value="Not Started">Not Started</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </TextField>
              </Grid>

              {/* Priority */}
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  id="priority"
                  name="priority"
                  label="Priority"
                  value={formik.values.priority}
                  onChange={formik.handleChange}
                  error={formik.touched.priority && Boolean(formik.errors.priority)}
                  helperText={formik.touched.priority && formik.errors.priority}
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </TextField>
              </Grid>

              {/* Repeat */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1">Repeat</Typography>
                <Switch
                  id="repeat"
                  name="repeat"
                  checked={formik.values.repeat}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* Bill Number */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="billNumber"
                  name="billNumber"
                  label="Bill Number"
                  value={formik.values.billNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.billNumber && Boolean(formik.errors.billNumber)}
                  helperText={formik.touched.billNumber && formik.errors.billNumber}
                />
              </Grid>

              {/* Owner Email1 */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="ownerEmail1"
                  name="ownerEmail1"
                  label="Owner Email1"
                  value={formik.values.ownerEmail1}
                  onChange={formik.handleChange}
                  error={formik.touched.ownerEmail1 && Boolean(formik.errors.ownerEmail1)}
                  helperText={formik.touched.ownerEmail1 && formik.errors.ownerEmail1}
                />
              </Grid>

              {/* Reminder */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1">Reminder</Typography>
                <Switch
                  id="reminder"
                  name="reminder"
                  checked={formik.values.reminder}
                  onChange={formik.handleChange}
                />
              </Grid>

              {/* Old Record Id1 */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="oldRecordId1"
                  name="oldRecordId1"
                  label="Old Record Id1"
                  value={formik.values.oldRecordId1}
                  onChange={formik.handleChange}
                />
              </Grid>
            </Grid>

            {/* Description Information */}
            <Typography variant="h4" gutterBottom sx={{ marginTop: '24px' }}>
              Description Information
            </Typography>
            <Grid container spacing={2}>
              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  multiline
                  rows={4}
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

      {/* View Task Details Tab */}
      {tabIndex === 1 && (
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task Owner</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.taskOwner}</TableCell>
                    <TableCell>{item.subject}</TableCell>
                    <TableCell>{item.dueDate}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.priority}</TableCell>
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
