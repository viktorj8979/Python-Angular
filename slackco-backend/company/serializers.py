from rest_framework import serializers

from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    """
    Company serializer
    """
    class Meta:
        model = Company
        exclude = ('owner', 'affiliated_companies')
