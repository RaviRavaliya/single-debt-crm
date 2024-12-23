import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, IconButton, Card, CardContent, Chip, Divider } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ApplicantPersonalDetailsModal from './ApplicantPersonalDetailsModal';
import FirstApplicantAddressModal from './FirstApplicantAddressModal';
import LeadDetailsModal from './LeadDetailsModal';
import LeadStatusModal from './LeadStatusModal';
import MainDetailsModal from './MainDetailsModal';
import WebsiteDetailsModal from './WebsiteDetailsModal';
import EmploymentQualificationModal from './EmploymentQualificationModal';
import ENACHDetailsModal from './ENACHDetailsModal';
import CustomerDocumentsModal from './CustomerDocumentsModal';
import DocumentsURLModal from './DocumentsURLModal';
import CreditorDebtDetailsModal from './CreditorDebtDetailsModal';
import MonthlyExpenditureModal from './MonthlyExpenditure';
import IncomeExpenditureModal from './IncomeExpenditureModal';
import CreateProformaInvoiceModal from './CreateProformaInvoiceModal';
import TaxInvoiceModal from './TaxInvoiceModal';
import CreateProfileModal from './CreateProfileModal';
import CreateCreditorRecordModal from './CreateCreditorRecordModal';
import CreateRatingsModal from './CreateRatingsModal';
import CreateBillModal from './CreateBillModal'; // Import CreateBillModal component
import SDPortalModal from './SDPortalModal'; // Import SDPortalModal component
import AttachmentUploadModal from './AttachmentUploadModal';
import CreateTaskModal from './CreateTaskModal';
import CreatePTPModal from './CreatePTPModal';
import CreateZohoSign from './CreateZohoSign';
import WhatsAppMessagesFormModal from './WhatsAppMessagesFormModal';
import TrialPDPInvoicesFormModal from './TrialPDPInvoicesFormModal';
import CreditorPaymentModal from './CreditorPaymentModal';
import DMPDetailModal from './DMPDetailModal';


export default function LeadDetails() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [leadDetails, setLeadDetails] = useState<any | null>(null);

  // Load lead details from localStorage on component mount
  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem('leadDetails') || 'null');
    if (savedDetails) {
      setLeadDetails(savedDetails);
    }
  }, []);

  const handleOpenModal = (modalName: string) => {
    setOpenModal(modalName);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  const handleSave = (data: any) => {
    console.log('Saved data:', data);
    setLeadDetails(data);
    handleCloseModal();
  };

  const cards = [
    { label: 'Personal Details', modal: 'applicantPersonalDetails' },
    { label: 'Applicant Address', modal: 'firstApplicantAddress' },
    { label: 'Lead Details', modal: 'leadDetails' },
    { label: 'Lead Status', modal: 'leadStatus' },
    { label: 'Main Details', modal: 'mainDetails' },
    { label: 'Website Details', modal: 'websiteDetails' },
    { label: 'Employment Qualification', modal: 'employmentQualification' },
    { label: 'ENACH Details', modal: 'enachDetails' },
    { label: 'Customer Documents', modal: 'customerDocuments' },
    { label: 'Documents URL', modal: 'documentsURL' },
    { label: 'Creditor Debt Details', modal: 'creditorDebtDetails' },
    { label: 'Monthly Expenditure', modal: 'monthlyExpenditure' },
    { label: 'Income and Expenditure', modal: 'incomeExpenditure' }
  ];

  return (
    <Container>
      {/* Show Lead Details if they exist */}
      {leadDetails ? (
        <Card sx={{ marginBottom: '2rem', padding: '16px', borderRadius: '16px' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: '600', color: '#2e7d32' }}>
              Lead Details
            </Typography>
            <Grid container spacing={2}>
              {leadDetails.firstName && leadDetails.lastName && (
                <Grid item xs={12} md={4}>
                  <Typography variant="body1">
                    <strong>Name:</strong> {leadDetails.firstName + ' ' + leadDetails.lastName}
                  </Typography>
                </Grid>
              )}
              {/* {leadDetails.lastName && (
                <Grid item xs={12} md={4}>
                  <Typography variant="body1">
                    <strong>Last Name:</strong> {leadDetails.lastName}
                  </Typography>
                </Grid>
              )} */}
              {leadDetails.emailID && (
                <Grid item xs={12} md={4}>
                  <Typography variant="body1">
                    <strong>Email ID:</strong> {leadDetails.emailID}
                  </Typography>
                </Grid>
              )}
              {leadDetails.phoneNumber && (
                <Grid item xs={12} md={4}>
                  <Typography variant="body1">
                    <strong>Phone Number:</strong> {leadDetails.phoneNumber}
                  </Typography>
                </Grid>
              )}
              {leadDetails.leadOwner && (
                <Grid item xs={12} md={4}>
                  <Typography variant="body1">
                    <strong>Lead Owner:</strong> {leadDetails.leadOwner}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: '700',
            textAlign: 'center',
            color: '#2e7d32',
            marginBottom: '3rem',
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          Manage Your Lead Sections 🚀
        </Typography>
      )}

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card.modal}>
            <Box
              sx={{
                position: 'relative',
                padding: 3,
                border: '1px solid #ddd',
                borderRadius: '16px',
                backgroundColor: '#ffffff',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.4s ease',
                textAlign: 'left',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
                  transform: 'scale(1.06)',
                  backgroundColor: '#f5fafd'
                }
              }}
              onClick={() => handleOpenModal(card.modal)}
            >
              <Typography
                variant="h6"
                sx={{
                  marginBottom: 1.5,
                  fontWeight: '600',
                  color: '#333',
                  fontSize: '1rem',
                  fontFamily: "'Roboto', sans-serif"
                }}
              >
                {card.label}
              </Typography>
              <IconButton
                aria-label="add"
                onClick={() => handleOpenModal(card.modal)}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  transition: 'background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#388e3c'
                  },
                  boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <AddCircleOutlineIcon fontSize="large" />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Divider with margin */}
      <Divider sx={{ marginY: '3rem', width: '100%' }} />

      {/* Add Proforma, Tax Invoice, Create Profile, Create Bill, and others */}
      <Box sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <Chip
          label="Proforma Invoice"
          clickable
          color="primary"
          variant="outlined"
          onClick={() => handleOpenModal('createInvoice')}
          sx={{
            fontSize: '1rem',
            padding: '1rem',
            borderRadius: '16px',
            color: 'primary',
            '&:hover': {
              backgroundColor: '#4caf50',
              color: '#000'
            }
          }}
        />
        <Chip
          label="Tax Invoice"
          clickable
          color="primary"
          variant="outlined"
          onClick={() => handleOpenModal('taxInvoice')}
          sx={{
            fontSize: '1rem',
            padding: '1rem',
            borderRadius: '16px',
            color: 'primary',
            '&:hover': {
              backgroundColor: '#ff9800',
              color: '#000'
            }
          }}
        />
        <Chip
          label="Create Profile"
          clickable
          color="primary"
          variant="outlined"
          onClick={() => handleOpenModal('createProfile')}
          sx={{
            fontSize: '1rem',
            padding: '1rem',
            borderRadius: '16px',
            color: 'success',
            '&:hover': {
              backgroundColor: '#43a047',
              color: '#000'
            }
          }}
        />
        <Chip
          label="Create Bill"
          clickable
          color="primary"
          variant="outlined"
          onClick={() => handleOpenModal('createBill')}
          sx={{
            fontSize: '1rem',
            padding: '1rem',
            borderRadius: '16px',
            color: 'primary',
            '&:hover': {
              backgroundColor: '#4caf50',
              color: '#000'
            }
          }}
        />

        <Chip
          label="SD Portal"
          clickable
          color="primary"
          variant="outlined"
          onClick={() => handleOpenModal('sdPortal')}
          sx={{
            fontSize: '1rem',
            padding: '1rem',
            borderRadius: '16px',
            color: 'primary',
            '&:hover': {
              backgroundColor: '#4caf50',
              color: '#000'
            }
          }}
        />
        <Chip
          label="Creditor Record"
          clickable
          color="primary"
          variant="outlined"
          onClick={() => handleOpenModal('createCreditorRecord')}
          sx={{
            fontSize: '1rem',
            padding: '1rem',
            borderRadius: '16px',
            color: 'primary',
            '&:hover': {
              backgroundColor: '#4caf50',
              color: '#000'
            }
          }}
        />
        <Chip
          label="Ratings"
          clickable
          color="primary"
          variant="outlined"
          onClick={() => handleOpenModal('createRatings')}
          sx={{
            fontSize: '1rem',
            padding: '1rem',
            borderRadius: '16px',
            color: 'primary',
            '&:hover': {
              backgroundColor: '#4caf50',
              color: '#000'
            }
          }}
        />
        <Chip
          label="Create Task"
          clickable
          color="primary"
          variant="outlined"
          onClick={() => handleOpenModal('createTask')}
          sx={{
            fontSize: '1rem',
            padding: '1rem',
            borderRadius: '16px',
            color: 'primary',
            '&:hover': {
              backgroundColor: '#4caf50',
              color: '#000'
            }
          }}
        />
        <Chip
          label="Attachment Upload"
          clickable
          color="primary"
          variant="outlined"
          onClick={() => handleOpenModal('attachmentUpload')}
          sx={{
            fontSize: '1rem',
            padding: '1rem',
            borderRadius: '16px',
            color: 'primary',
            '&:hover': {
              backgroundColor: '#4caf50',
              color: '#000'
            }
          }}
        />
        <Chip
          label="Create PTP"
          clickable
          color="primary"
          variant="outlined"
          onClick={() => handleOpenModal('createPTP')}
          sx={{
            fontSize: '1rem',
            padding: '1rem',
            borderRadius: '16px',
            color: 'primary',
            '&:hover': {
              backgroundColor: '#4caf50',
              color: '#000'
            }
          }}
        />
        <Chip
          label="Create ZohoSign"
          clickable
          color="primary"
          variant="outlined"
          onClick={() => handleOpenModal('createZohoSign')}
          sx={{
            fontSize: '1rem',
            padding: '1rem',
            borderRadius: '16px',
            color: 'primary',
            '&:hover': {
              backgroundColor: '#4caf50',
              color: '#000'
            }
          }}
        />
          <Chip
          label="WhatsApp Messages"
          clickable
          color="primary"
          variant="outlined"
          onClick={() => handleOpenModal('whatsappMessages')}
          sx={{
            fontSize: '1rem',
            padding: '1rem',
            borderRadius: '16px',
            color: 'primary',
            '&:hover': {
              backgroundColor: '#4caf50',
              color: '#000'
            }
          }}
        />
        <Chip
          label="Trial PDP Invoices Form"
          clickable
          color="primary"
          variant="outlined"
          onClick={() => handleOpenModal('trialPDPInvoicesForm')}
          sx={{
            fontSize: '1rem',
            padding: '1rem',
            borderRadius: '16px',
            color: 'primary',
            '&:hover': {
              backgroundColor: '#4caf50',
              color: '#000'
            }
          }}
        />
             <Chip
          label="Creditor payment"
          clickable
          color="primary"
          variant="outlined"
          onClick={() => handleOpenModal('creditorPayment')}
          sx={{
            fontSize: '1rem',
            padding: '1rem',
            borderRadius: '16px',
            color: 'primary',
            '&:hover': {
              backgroundColor: '#4caf50',
              color: '#000'
            }
          }}
        />
           <Chip
          label=" DMP Payout"
          clickable
          color="primary"
          variant="outlined"
          onClick={() => handleOpenModal('dmpDetail')}
          sx={{
            fontSize: '1rem',
            padding: '1rem',
            borderRadius: '16px',
            color: 'primary',
            '&:hover': {
              backgroundColor: '#4caf50',
              color: '#000'
            }
          }}
        />
      </Box>

      {/* Modals */}
      {openModal === 'applicantPersonalDetails' && (
        <ApplicantPersonalDetailsModal open={true} onClose={handleCloseModal} onSave={handleSave} />
      )}
      {openModal === 'firstApplicantAddress' && <FirstApplicantAddressModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'leadDetails' && <LeadDetailsModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'leadStatus' && <LeadStatusModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'mainDetails' && <MainDetailsModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'websiteDetails' && <WebsiteDetailsModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'employmentQualification' && (
        <EmploymentQualificationModal open={true} onClose={handleCloseModal} onSave={handleSave} />
      )}
      {openModal === 'enachDetails' && <ENACHDetailsModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'customerDocuments' && <CustomerDocumentsModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'documentsURL' && <DocumentsURLModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'creditorDebtDetails' && <CreditorDebtDetailsModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'monthlyExpenditure' && <MonthlyExpenditureModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'incomeExpenditure' && <IncomeExpenditureModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'createInvoice' && <CreateProformaInvoiceModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'taxInvoice' && <TaxInvoiceModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'createProfile' && <CreateProfileModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'createCreditorRecord' && <CreateCreditorRecordModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'createRatings' && <CreateRatingsModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'createBill' && <CreateBillModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'createTask' && <CreateTaskModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'attachmentUpload' && (
        <AttachmentUploadModal open={openModal === 'attachmentUpload'} onClose={handleCloseModal} onSave={handleSave} />
      )}
      {openModal === 'sdPortal' && <SDPortalModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'createPTP' && <CreatePTPModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'createZohoSign' && <CreateZohoSign open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'whatsappMessages' && <WhatsAppMessagesFormModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'trialPDPInvoicesForm' && <TrialPDPInvoicesFormModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'dmpDetail' && <DMPDetailModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      {openModal === 'creditorPayment' && <CreditorPaymentModal open={true} onClose={handleCloseModal} onSave={handleSave} />}
      
    </Container>
  );
}
