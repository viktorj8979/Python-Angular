from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.utils.translation import ugettext as _
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from django.utils import timezone

from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.compat import Serializer, PasswordField

from .models import Company, LoginMagicLink, UserProfile, EmailConfirmation, PasswordResetRequest

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class JSONWebTokenSerializer(Serializer):
    """
    Serializer class used to validate a company name, email and password.

    Returns a JSON Web Token that can be used to authenticate later calls.
    """
    company_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    password = PasswordField(write_only=True)

    def validate(self, attrs):
        credentials = {
            'company_name': attrs.get('company_name'),
            'email': attrs.get('email'),
            'password': attrs.get('password')
        }

        if all(credentials.values()):
            # it's required to get User object from email
            try:
                user = User.objects.get(email=credentials['email'])
            except User.DoesNotExist:
                msg = _('Unable to login with provided credentials.')
                raise serializers.ValidationError(msg)

            user = authenticate(username=user.username, password=credentials['password'])

            if user:
                if not user.is_active:
                    msg = _('User account is disabled.')
                    raise serializers.ValidationError(msg)

                # check if user belongs to company
                if user.profile.company.name.lower() != credentials['company_name'].lower():
                    msg = _('Unable to login with provided credentials.')
                    raise serializers.ValidationError(msg)

                payload = jwt_payload_handler(user)

                return {
                    'token': jwt_encode_handler(payload),
                    'user': user
                }
            else:
                msg = _('Unable to login with provided credentials.')
                raise serializers.ValidationError(msg)
        else:
            msg = _('Must include "company_name", "email" and "password".')
            raise serializers.ValidationError(msg)


class SignUpUserSerializer(Serializer):
    """
    User Serializer that is for getting displayable information about users.
    """
    company_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        min_length = 8,
        error_messages = {"min_length": "Password should be longer than 8 characters"}
    )

    def validate_company_name(self, value):
        """
        Check that company name already exist
        """
        try:
            company = Company.objects.get(name__iexact=value.lower())
            raise serializers.ValidationError(_('company name is already exist on system'))
        except Company.DoesNotExist:
            pass
        return value

    def validate_email(self, value):
        """
        Check that email already registered
        """
        try:
            user = User.objects.get(email__iexact=value.lower())
            raise serializers.ValidationError(_('email is already exist on system'))
        except User.DoesNotExist:
            pass
        return value

    def create(self, validated_data):
        company_name = validated_data['company_name']
        email = validated_data['email']
        password = validated_data['password']

        # create user
        user = User.objects.create(username=email, email=email)

        user.is_active = False
        user.set_password(password)
        user.save()

        # create company
        company = Company.objects.create(name=company_name, owner=user)
        company.save()

        # create user profile
        profile = UserProfile.objects.create(user=user, company=company)
        profile.save()

        # send verification email
        confirm_email = EmailConfirmation.create(profile)
        confirm_email.send_email()

        return {
            'result': "success",
        }


class MagicLinkSerializer(Serializer):
    """
    MagicLinkSerializer used to create MagicLink
    """
    company_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()

    def validate_company_name(self, value):
        """
        Check that company name is valid
        """
        try:
            company = Company.objects.get(name__iexact=value.lower())
        except Company.DoesNotExist:
            raise serializers.ValidationError(_('company name is invalid'))
        return company

    def validate_email(self, value):
        """
        Check that email already registered
        """
        try:
            user = User.objects.get(email__iexact=value.lower())
        except User.DoesNotExist:
            raise serializers.ValidationError(_('email is invalid'))
        return user

    def validate(self, data):
        """
        Check if user belongs to company
        """
        try:
            if data['email'].profile.company != data['company_name']:
                raise serializers.ValidationError("company_name and email are invalid")
        except ObjectDoesNotExist:
            raise serializers.ValidationError("company_name and email are invalid")

        # check if user is active
        if not data['email'].is_active:
            raise serializers.ValidationError(_('User account is disabled.'))

        return data

    def create(self, validated_data):
        company = validated_data['company_name']
        user = validated_data['email']

        magic_link = LoginMagicLink.create(user.profile, company)
        magic_link.send_magic_email()

        return {
            'result': "success",
            'key': magic_link.key,
        }


class JSONWebTokenMagicLinkSerializer(Serializer):
    """
    Serializer class used to validate magic key

    Returns a JSON Web Token that can be used to authenticate later calls.
    """
    magic_key = serializers.CharField(max_length=64)

    def validate(self, data):
        try:
            magic_link = LoginMagicLink.objects.get(key = data['magic_key'])
        except ObjectDoesNotExist:
            raise serializers.ValidationError(_("magic_key is invalid"))

        # check if magic key is expired
        expiration_dt = magic_link.sent + settings.MAGIC_LINK_EXPIRATION_DELTA
        if expiration_dt <= timezone.now():
            raise serializers.ValidationError(_("magic_key is expired"))
    
        user = magic_link.user_profile.user

        if not user.is_active:
            msg = _('User account is disabled.')
            raise serializers.ValidationError(msg)

        # delete magic link as it's used
        magic_link.delete()

        payload = jwt_payload_handler(user)

        return {
            'token': jwt_encode_handler(payload),
            'user': user
        }


class UserActivationSerializer(Serializer):
    """
    Serializer to activate user account with verification code
    """
    verify_key = serializers.CharField(max_length=64)

    def validate(self, data):
        try:
            email_confirmation = EmailConfirmation.objects.get(key=data['verify_key'], verified=False)
        except ObjectDoesNotExist:
            raise serializers.ValidationError(_('verify_key is invalid'))

        # check if verify key is expired
        expiration_dt = email_confirmation.sent + settings.ACCOUNT_ACTIVATION_EXPIRY
        if expiration_dt <= timezone.now():
            raise serializers.ValidationError(_("verify_key is expired"))

        email_confirmation.user_profile.user.is_active = True
        email_confirmation.user_profile.user.save()
        email_confirmation.verified = True
        email_confirmation.save()

        return {
            'result': 'success'
        }


class UserProfileSerializer(serializers.ModelSerializer):
    """
    User profile serializer
    """
    first_name = serializers.CharField(max_length=30, allow_blank=True, source='user.first_name')
    last_name = serializers.CharField(max_length=30, allow_blank=True, source='user.last_name')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = UserProfile
        fields = ('first_name', 'last_name', 'email', 'role', 'department')

    def update(self, instance, validated_data):
        instance.user.first_name = validated_data.get('first_name', instance.user.first_name)
        instance.user.last_name = validated_data.get('last_name', instance.user.last_name)
        instance.user.email = validated_data.get('email_name', instance.user.email)
        instance.role = validated_data.get('role', instance.role)
        instance.department = validated_data.get('department', instance.department)
        instance.user.save()
        instance.save()
        return instance


class PasswordResetSerializer(Serializer):
    """
    Serializer to reset user password
    """
    company_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()

    def validate_company_name(self, value):
        """
        Check that company name is valid
        """
        try:
            company = Company.objects.get(name__iexact=value.lower())
        except Company.DoesNotExist:
            raise serializers.ValidationError(_('company name is invalid'))
        return company

    def validate_email(self, value):
        """
        Check that email already registered
        """
        try:
            user = User.objects.get(email__iexact=value.lower())
        except User.DoesNotExist:
            raise serializers.ValidationError(_('email is invalid'))
        return user

    def validate(self, data):
        # validate if company_name and email is valid
        try:
            user_profile = UserProfile.objects.get(company = data['company_name'], user=data['email'])
        except ObjectDoesNotExist:
            raise serializers.ValidationError(_('Invalid company_name or email'))

        # check if user is active
        if not data['email'].is_active:
            raise serializers.ValidationError(_('User account is disabled.'))

        return data

    def create(self, validated_data):
        user = validated_data['email']

        reset_request = PasswordResetRequest.create(user.profile)
        reset_request.send_email()

        return {
            'result': "success",
            'key': reset_request.key,
        }


class PasswordNewSerializer(Serializer):
    """
    Serializer to reset user account with verification code
    """
    reset_key = serializers.CharField(max_length=64)
    password = serializers.CharField(style={'input_type': 'password'}, min_length=8)

    def validate_reset_key(self, value):
        """
        Check if reset_key is valid
        """
        try:
            reset_request = PasswordResetRequest.objects.get(key=value, used=False)
        except ObjectDoesNotExist:
            raise serializers.ValidationError(_('reset_key is invalid'))

        # check if verify key is expired
        expiration_dt = reset_request.sent + settings.PASSWORD_RESET_EXPIRY
        if expiration_dt <= timezone.now():
            raise serializers.ValidationError(_("reset_key is expired"))

        return reset_request

    def validate(self, data):
        reset_request = data['reset_key']
        new_password = data['password']
        reset_request.user_profile.user.set_password(new_password)
        reset_request.user_profile.user.save()
        reset_request.used = True
        reset_request.save()
        return {
            'result': 'success'
        }


class UserPasswordChangeSerializer(Serializer):
    """
    Serializer to be used for change password
    """
    old_password = serializers.CharField(
        style={'input_type': 'password'},
        min_length = 8,
        error_messages = {"min_length": "Password should be longer than 8 characters"}
    )
    new_password = serializers.CharField(
        style={'input_type': 'password'},
        min_length = 8,
        error_messages = {"min_length": "Password should be longer than 8 characters"}
    )

    def validate_old_password(self, value):
        if not self.context['request'].user.check_password(value):
            raise serializers.ValidationError(_('password is not correct'))
        return value

    def validate(self, data):
        old_password = data['old_password']
        new_password = data['new_password']

        if old_password.lower() == new_password.lower():
            raise serializers.ValidationError(_("old and new password are same"))

        return data

