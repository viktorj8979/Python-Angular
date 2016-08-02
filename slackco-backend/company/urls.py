from django.conf.urls import url

from rest_framework.routers import DefaultRouter

from .views import CompanyProfileView
from .views import CompanyViewSet


router = DefaultRouter()
router.register(r'list', CompanyViewSet)
urlpatterns = router.urls

urlpatterns += [
    # User profile api
    url(r'^profile/$', CompanyProfileView.as_view(), name='profile'),
]
