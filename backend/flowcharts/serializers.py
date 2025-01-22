from rest_framework import serializers
from .models import Flowchart


class FlowchartSerializer(serializers.ModelSerializer):

    class Meta:
        model = Flowchart
        fields = '__all__'