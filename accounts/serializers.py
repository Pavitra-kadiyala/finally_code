from rest_framework import serializers
from .models import Account, Transaction
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class AccountSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Account
        fields = ['id', 'account_number', 'current_balance', 'user']

class TransactionSerializer(serializers.ModelSerializer):
    # Use a PrimaryKeyRelatedField for the account to allow specifying by ID
    account = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all())

    class Meta:
        model = Transaction
        fields = ['id', 'date', 'transaction_type', 'note', 'amount', 'account']


