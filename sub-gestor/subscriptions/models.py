from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


class Subscription(models.Model):
    CATEGORY_CHOICES = [
        ("streaming", _("Streaming")),
        ("software", _("Software")),
        ("productivity", _("Productividad")),
        ("gaming", _("Videojuegos")),
        ("other", _("Otro")),
    ]

    PAYMENT_METHOD_CHOICES = [
        ("card", _("Tarjeta")),
        ("paypal", _("PayPal")),
    ]

    BILLING_CYCLE_CHOICES = [
        ("monthly", _("Mensual")),
        ("yearly", _("Anual")),
        ("weekly", _("Semanal")),
        ("once", _("Pago único")),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="subscriptions"
    )
    service_name = models.CharField(max_length=100)
    category = models.CharField(
        max_length=50, choices=CATEGORY_CHOICES, default="other"
    )
    price = models.DecimalField(max_digits=8, decimal_places=2)
    currency = models.CharField(max_length=10, default="EUR")
    billing_cycle = models.CharField(
        max_length=20, choices=BILLING_CYCLE_CHOICES, default="monthly"
    )
    start_date = models.DateField()
    next_payment_date = models.DateField()
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_METHOD_CHOICES, default="card"
    )
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.service_name} - {self.user.username}"


class PaymentLog(models.Model):
    subscription = models.ForeignKey(
        Subscription, on_delete=models.CASCADE, related_name="payments"
    )
    amount = models.DecimalField(max_digits=7, decimal_places=2)
    date = models.DateField()

    def __str__(self):
        return f"{self.subscription.service_name} - {self.amount}€ on {self.date}"
