from rest_framework import serializers
from .models import Subscription, PaymentLog


class PaymentLogSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(
        source="subscription.service_name", read_only=True
    )

    class Meta:
        model = PaymentLog
        fields = ["id", "subscription", "service_name", "amount", "date"]


class SubscriptionSerializer(serializers.ModelSerializer):
    payments = PaymentLogSerializer(many=True, read_only=True)

    class Meta:
        model = Subscription
        fields = "__all__"
        read_only_fields = ["user", "created_at"]
