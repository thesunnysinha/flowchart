from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FlowchartViewSet

router = DefaultRouter()
router.register('flowcharts', FlowchartViewSet)

urlpatterns = [
    path('', include(router.urls)),
]