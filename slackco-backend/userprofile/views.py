from django.contrib.auth.models import User

from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_jwt.views import JSONWebTokenAPIView

from .models import LoginMagicLink, UserProfile, PasswordResetRequest
from .serializers import JSONWebTokenSerializer, MagicLinkSerializer, JSONWebTokenMagicLinkSerializer
from .serializers import SignUpUserSerializer, UserActivationSerializer
from .serializers import UserProfileSerializer
from .serializers import PasswordResetSerializer, PasswordNewSerializer
from .serializers import UserPasswordChangeSerializer


class ObtainJSONWebToken(JSONWebTokenAPIView):
    """
    API View that receives a POST with a user's email and password along with company_name.

    Returns a JSON Web Token that can be used for authenticated requests.
    """
    serializer_class = JSONWebTokenSerializer


class CustomCreateAPIView(CreateAPIView):
    """
    Customized CreateAPIView to let serializer create instance
    """
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = self.perform_create(serializer)
        headers = self.get_success_headers(data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        return serializer.save()


class SignUpView(CustomCreateAPIView):
    """
    API view to create company and its owner
    Parameters: company_name, email, password
    """
    model = User
    permission_classes = (AllowAny,)
    serializer_class = SignUpUserSerializer


class MagicLinkView(CustomCreateAPIView):
    """
    API view to send an email with magic login link
    Parameters: company_name, email
    """
    model = LoginMagicLink
    permission_classes = (AllowAny,)
    serializer_class = MagicLinkSerializer


class ObtainJSONWebTokenFromMagicLink(JSONWebTokenAPIView):
    """
    API view to get token from magic link
    """
    serializer_class = JSONWebTokenMagicLinkSerializer


class ActivateAccountView(CustomCreateAPIView):
    """
    Activate account based on verification code sent to email
    """
    serializer_class = UserActivationSerializer
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"result": "success"})


class UserProfileView(RetrieveUpdateAPIView):
    """
    User Profile view to get and update
    """
    model = UserProfile
    permission_classes = (IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user.profile


class PasswordResetView(CustomCreateAPIView):
    """
    API to password reset link to user's email account
    """
    model = PasswordResetRequest
    serializer_class = PasswordResetSerializer
    permission_classes = (AllowAny,)


class PasswordNewView(CustomCreateAPIView):
    """
    Activate account based on verification code sent to email
    """
    serializer_class = PasswordNewSerializer
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"result": "success"})


class PasswordChangeView(GenericAPIView):
    """
    Password change with old and new password
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = UserPasswordChangeSerializer

    def get_object(self):
        return self.request.user

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"result": "success"})

    def perform_update(self, serializer):
        self.request.user.set_password(serializer.data['new_password'])
        self.request.user.save()

