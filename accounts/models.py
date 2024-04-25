from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save

class Account(models.Model):
    account_number = models.CharField(max_length=16, unique=True)
    current_balance = models.DecimalField(max_digits=10, decimal_places=2)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='accounts')


class Transaction(models.Model):
    TRANSACTION_TYPE_CHOICES = [('CREDIT', 'Credit'), ('DEBIT', 'Debit')]
    date = models.DateTimeField(auto_now_add=True)
    transaction_type = models.CharField(max_length=6, choices=TRANSACTION_TYPE_CHOICES)
    note = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='transactions')

# Use signal to update Account balance after Transaction save
@receiver(post_save, sender=Transaction)
def update_balance(sender, instance, **kwargs):
    account = instance.account
    if instance.transaction_type == 'CREDIT':
        account.current_balance += instance.amount
    elif instance.transaction_type == 'DEBIT':
        account.current_balance -= instance.amount
    account.save()

