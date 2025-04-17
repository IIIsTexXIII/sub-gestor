from django.core.management.base import BaseCommand
from subscriptions.models import Subscription, PaymentLog
from datetime import date, timedelta


class Command(BaseCommand):
    help = "Procesa pagos vencidos y registra en el historial"

    def handle(self, *args, **kwargs):
        hoy = date.today()
        procesadas = 0

        subs = Subscription.objects.filter(is_active=True, next_payment_date__lte=hoy)
        for sub in subs:
            PaymentLog.objects.create(subscription=sub, amount=sub.price)
            # Calcular nueva fecha según ciclo
            if sub.billing_cycle == "monthly":
                delta = timedelta(days=30)
            elif sub.billing_cycle == "weekly":
                delta = timedelta(weeks=1)
            elif sub.billing_cycle == "yearly":
                delta = timedelta(days=365)
            elif sub.billing_cycle == "once":
                sub.is_active = False
                delta = None
            else:
                delta = None

            if delta:
                sub.next_payment_date = sub.next_payment_date + delta

            sub.save()
            procesadas += 1

        self.stdout.write(self.style.SUCCESS(f"{procesadas} pagos procesados."))
