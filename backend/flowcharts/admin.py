from django.contrib import admin

from flowcharts.models import Flowchart

# Admin Registration
@admin.register(Flowchart)
class FlowchartAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'data', 'created_at')
