from django.contrib import admin

from flowcharts.models import Edge, Flowchart, Node

# Admin Registration
@admin.register(Flowchart)
class FlowchartAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'created_at')

@admin.register(Node)
class NodeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'flowchart')

@admin.register(Edge)
class EdgeAdmin(admin.ModelAdmin):
    list_display = ('id', 'source', 'target', 'flowchart')
