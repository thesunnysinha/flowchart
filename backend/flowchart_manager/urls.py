
from django.contrib import admin
from django.urls import path,include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from flowcharts import urls as flowchart_urls

schema_view = get_schema_view(
    openapi.Info(
        title="Flowchart API",
        default_version='v1',
    ),
    public=True,
)



urlpatterns = [
    path('admin/', admin.site.urls),
]

urlpatterns += [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]

# Include the flowchart URLs
urlpatterns += [
    path('api/', include(flowchart_urls)),
]