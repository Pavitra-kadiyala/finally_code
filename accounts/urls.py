from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, TransactionViewSet, account_balance
from .views import LoginView, accounts_by_user_id, transactions_by_user_id


router = DefaultRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'transactions', TransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('accounts/<int:pk>/balance/<int:year>/<int:month>/<int:day>/', account_balance, name='account-balance'),
    path('accounts/user/<int:user_id>/', accounts_by_user_id, name='accounts-by-user-id'),
    path('gettransactions/<int:user_id>/', transactions_by_user_id, name='transactions-by-user-id'),
]
