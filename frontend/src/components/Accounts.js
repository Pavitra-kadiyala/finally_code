import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { useUser } from '../UserContext';

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    // Fetch the accounts from the API
    const fetchAccounts = async () => {
      const response = await fetch(`http://127.0.0.1:8000/api/accounts/user/${user.userId}/`);
      const data = await response.json();
      if (response.ok) {
        setAccounts(data);
      } else {
        alert('Failed to fetch accounts');
      }
    };

    if (user.userId) {
      fetchAccounts();
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Accounts
      </Typography>
      <Grid container spacing={4}>
        {accounts.map((account) => (
          <Grid item xs={12} sm={6} md={4} key={account.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  Account Number
                </Typography>
                <Typography color="textSecondary">
                  {account.account_number}
                </Typography>
                <Typography variant="body2" component="p">
                  Current Balance
                </Typography>
                <Typography variant="h6">
                  ${account.current_balance}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/transactions/${account.id}`)}
                >
                  View Transactions
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Accounts;