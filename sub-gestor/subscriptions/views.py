from rest_framework import viewsets, status
from .models import Subscription, PaymentLog
from .serializers import SubscriptionSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response
from datetime import date, timedelta
from django.contrib.auth.models import User
from dateutil.relativedelta import (
    relativedelta,
)


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Mostrar solo las suscripciones del usuario autenticado
        return Subscription.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Asignar automáticamente el usuario que crea la suscripción
        serializer.save(user=self.request.user)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def process_payments_view(request):
    hoy = date.today()
    procesadas = 0

    subs = Subscription.objects.filter(is_active=True)
    for sub in subs:
        ultima_fecha = sub.start_date

        # si ya hubo pagos, continuar desde el último
        last_payment = (
            PaymentLog.objects.filter(subscription=sub).order_by("-date").first()
        )
        if last_payment:
            ultima_fecha = last_payment.date

        while ultima_fecha <= hoy:
            # evitar duplicados
            if not PaymentLog.objects.filter(
                subscription=sub, date=ultima_fecha
            ).exists():
                PaymentLog.objects.create(
                    subscription=sub, amount=sub.price, date=ultima_fecha
                )
                procesadas += 1

            # avanzar al siguiente ciclo
            if sub.billing_cycle == "monthly":
                ultima_fecha += relativedelta(months=1)
            elif sub.billing_cycle == "weekly":
                ultima_fecha += timedelta(weeks=1)
            elif sub.billing_cycle == "yearly":
                ultima_fecha += relativedelta(years=1)
            elif sub.billing_cycle == "once":
                sub.is_active = False
                break

        # actualizar next_payment_date a la próxima futura
        sub.next_payment_date = ultima_fecha
        sub.save()

    return Response({"status": "ok", "procesadas": procesadas})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    user = request.user
    return Response(
        {
            "username": user.username,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        }
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Datos incompletos"}, status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "El usuario ya existe"}, status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(username=username, password=password)
    return Response({"success": "Usuario registrado correctamente"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def payment_history_view(request):
    user = request.user
    logs = PaymentLog.objects.filter(subscription__user=user).order_by("-date")
    from .serializers import PaymentLogSerializer

    serializer = PaymentLogSerializer(logs, many=True)
    return Response(serializer.data)
