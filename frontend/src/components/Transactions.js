import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions, MenuItem
} from '@mui/material';
import { useUser } from '../UserContext';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [open, setOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    transaction_type: '',
    note: '',
    amount: '',
  });
  const { accountId } = useParams(); // This is the account ID from the URL
  const { user } = useUser();

  useEffect(() => {
    const fetchTransactions = async () => {
      const endpoint = `http://127.0.0.1:8000/api/transactions/`;
      const response = await fetch(endpoint);
      const data = await response.json();
      if (response.ok) {
        const filteredTransactions = data.filter(t => t.account === parseInt(accountId));
        setTransactions(filteredTransactions);
      } else {
        alert('Failed to fetch transactions');
      }
    };

    fetchTransactions();
  }, [accountId]);

  const handleCreateTransaction = async () => {
    // API call to create a new transaction
    const response = await fetch('http://127.0.0.1:8000/api/transactions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include other headers as necessary, like authorization tokens
      },
      body: JSON.stringify({
        ...newTransaction,
        account: accountId, // The account ID for the transaction
      }),
    });
    if (response.ok) {
      const createdTransaction = await response.json();
      setTransactions([...transactions, createdTransaction]);
      handleClose(); // Reset and close the form
    } else {
      alert('Failed to create transaction');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setNewTransaction({ transaction_type: '', note: '', amount: '' }); // Reset the form
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  return (
    <Container maxWidth="lg">
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Create Transaction
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="transactions table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Transaction Type</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.transaction_type}</TableCell>
                {/* <TableCell>****{transaction.account.substring(transaction.account.length - 4)}</TableCell> */}
                <TableCell>{transaction.note}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Transaction</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Transaction Type"
            name="transaction_type"
            value={newTransaction.transaction_type}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="CREDIT">Credit</MenuItem>
            <MenuItem value="DEBIT">Debit</MenuItem>
          </TextField>
          <TextField
            label="Note"
            name="note"
            value={newTransaction.note}
            onChange={handleChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Amount"
            name="amount"
            value={newTransaction.amount}
            onChange={handleChange}
            type="number"
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateTransaction}>Create</Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper}>
        {/* The rest of your table code */}
      </TableContainer>
    </Container>
  );
}

export default Transactions;

