from django.shortcuts import render

from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets

from .models import Company
from .serializers import CompanySerializer


class CompanyProfileView(RetrieveUpdateAPIView):
    """
    API view to get or update company profile
    """
    model = Company
    permission_classes = (IsAuthenticated,)
    serializer_class = CompanySerializer

    def get_object(self):
        return self.request.user.companies_created.first()


class CompanyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A simple ViewSet for searching company with name or industry
    """
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_queryset(self):
        companies = Company.objects.all()
        if self.request.GET.get('name', None):
            companies = companies.filter(name__icontains=self.request.GET['name'])
        if self.request.GET.get('industry', None):
            companies = companies.filter(industry__icontains=self.request.GET['industry'])
        return companies
