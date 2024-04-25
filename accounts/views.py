from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Account, Transaction
from .serializers import AccountSerializer, TransactionSerializer
from django.db.models import Sum
from django.shortcuts import get_object_or_404
import datetime
from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, format=None): 
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({"detail": "Successfully logged in.", "user_id": user.id})
        return Response({"detail": "Invalid credentials."}, status=401)


@api_view(['GET'])
def account_balance(request, pk, year, month, day):
    account = get_object_or_404(Account, pk=pk)
    # Construct the date from URL parameters
    target_date = datetime.date(year, month, day)
    # Fetch transactions up to and including the target date
    transactions = Transaction.objects.filter(account=account, date__lte=target_date)
    # Aggregate transaction amounts
    balance_changes = transactions.aggregate(total=Sum('amount'))['total'] or 0
    # Return the calculated balance
    return Response({
        'account_id': account.id,
        'balance_as_of': target_date,
        'current_balance': balance_changes
    })

@api_view(['GET'])
def accounts_by_user_id(request, user_id):
    """
    Retrieve accounts for a specific user by user ID.
    """
    
    accounts = Account.objects.filter(user__id=user_id)
    serializer = AccountSerializer(accounts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def transactions_by_user_id(request, user_id):
    """
    Retrieve accounts for a specific user by user ID.
    """
    
    transaction = Transaction.objects.filter(user__id=user_id)
    serializer = TransactionSerializer(transaction, many=True)
    return Response(serializer.data)
