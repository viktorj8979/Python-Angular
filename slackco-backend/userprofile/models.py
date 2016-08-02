from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from django.utils import timezone
from django.conf import settings
from django.template.loader import render_to_string

from company.models import Company
from company.models import COMPANY_DEPARTMENT_CHOICES
from .helpers import EmailThread


class UserProfile(models.Model):
    """
    This model represents user's profile
    """
    user = models.OneToOneField(User, related_name="profile")

    company = models.ForeignKey(Company, blank=True, null=True)
    role = models.CharField("Role in The Company", max_length=200, blank=True, null=True)
    department = models.CharField("Department", max_length=200, blank=True, null=True, choices=COMPANY_DEPARTMENT_CHOICES)

    dt_created = models.DateTimeField(auto_now_add=True)
    dt_modified = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "User Profiles"
        verbose_name = "User Profile"


class EmailConfirmation(models.Model):
    """
    This model is used to verify user account with email address
    """
    user_profile = models.ForeignKey(UserProfile, related_name="confirmation_emails")
    sent = models.DateTimeField(null=True, blank=True)
    key = models.CharField(max_length=64, unique=True)
    verified = models.BooleanField(default=False)

    @classmethod
    def create(cls, profile):
        key = get_random_string(64).lower()
        return cls._default_manager.create(user_profile=profile, key=key)

    def send_email(self):
        """
        Send an activation email to user for confirmation
        """
        activation_link = settings.ACCOUNT_ACTIVATION_LINK % self.key
        ctx_dict = {'activation_link': activation_link}
        message = render_to_string('email/activation_email.txt', ctx_dict)
        EmailThread("Slackco Account Activation", message, settings.DEFAULT_FROM_EMAIL, [self.user_profile.user.email]).start()
        self.sent = timezone.now()
        self.save()


class LoginMagicLink(models.Model):
    """
    LoginMagicLink is used to login with magic link
    """
    user_profile = models.ForeignKey(UserProfile, related_name="magic_links")
    company = models.ForeignKey(Company, related_name="magic_links")
    sent = models.DateTimeField(null=True, blank=True)
    key = models.CharField(max_length=64, unique=True)

    @classmethod
    def create(cls, profile, company):
        key = get_random_string(64).lower()
        return cls._default_manager.create(user_profile=profile,
            company = company,
            key=key)

    def send_magic_email(self):
        """
        Send email with magic link to user
        """
        magic_link = settings.MAGIC_LOGIN_LINK % self.key
        ctx_dict = {'magic_link': magic_link}
        message = render_to_string('email/magic_login_email.txt', ctx_dict)
        EmailThread("Slackco Account Login", message, settings.DEFAULT_FROM_EMAIL, [self.user_profile.user.email]).start()
        self.sent = timezone.now()
        self.save()


class PasswordResetRequest(models.Model):
    """
    Password reset request
    """
    user_profile = models.ForeignKey(UserProfile, related_name="password_reset")
    sent = models.DateTimeField(null=True, blank=True)
    key = models.CharField(max_length=64, unique=True)
    used = models.BooleanField(default=False)

    @classmethod
    def create(cls, profile):
        key = get_random_string(64).lower()
        return cls._default_manager.create(user_profile=profile, key=key)

    def send_email(self):
        """
        Send an activation email to user for confirmation
        """
        activation_link = settings.PASSWORD_RESET_LINK % self.key
        ctx_dict = {'reset_password_link': activation_link}
        message = render_to_string('email/password_reset_email.txt', ctx_dict)
        EmailThread("Slackco Password Reset", message, settings.DEFAULT_FROM_EMAIL, [self.user_profile.user.email]).start()
        self.sent = timezone.now()
        self.save()
