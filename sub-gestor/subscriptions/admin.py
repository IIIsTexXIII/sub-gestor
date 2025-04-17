from django.contrib import admin
from .models import Subscription, PaymentLog


admin.site.register(Subscription)


@admin.register(PaymentLog)
class PaymentLogAdmin(admin.ModelAdmin):
    list_display = ("subscription", "amount", "date")
    list_filter = ("date", "subscription__service_name")
    search_fields = ("subscription__service_name",)

    actions = ["delete_selected"]

    @admin.action(description="Eliminar pagos seleccionados")
    def delete_selected(self, request, queryset):
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f"Se eliminaron {count} pagos.")
