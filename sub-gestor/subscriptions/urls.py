from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    SubscriptionViewSet,
    process_payments_view,
    current_user_view,
    register_view,
    payment_history_view,
)

router = DefaultRouter()
router.register(r"subscriptions", SubscriptionViewSet, basename="subscription")

urlpatterns = router.urls + [
    path("process-payments/", process_payments_view, name="process-payments"),
    path("me/", current_user_view, name="me"),
    path("register/", register_view),
    path("payment-history/", payment_history_view),
]
