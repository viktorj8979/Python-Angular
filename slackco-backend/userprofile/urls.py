from django.conf.urls import url

from rest_framework_jwt.views import refresh_jwt_token, verify_jwt_token

from .views import ObtainJSONWebToken, SignUpView, ActivateAccountView
from .views import MagicLinkView, ObtainJSONWebTokenFromMagicLink
from .views import UserProfileView
from .views import PasswordResetView, PasswordNewView
from .views import PasswordChangeView


urlpatterns = [
    url(r'^auth/login/$', ObtainJSONWebToken.as_view(), name='login'),
    url(r'^auth/api-token-refresh/$', refresh_jwt_token),
    url(r'^auth/api-token-verify/$', verify_jwt_token),

    # Sign-in with magic link
    url(r'^auth/magic-link/$', MagicLinkView.as_view(), name='magic_link'),
    url(r'^auth/login-by-link/$', ObtainJSONWebTokenFromMagicLink.as_view(), name='magic_link_login'),

    # Sign-up api
    url(r'^auth/register/$', SignUpView.as_view(), name='signup'),
    url(r'^auth/activate/$', ActivateAccountView.as_view(), name='activate_account'),

    # Password reset api
    url(r'^auth/reset-password/$', PasswordResetView.as_view(), name='password_reset'),
    url(r'^auth/new-password/$', PasswordNewView.as_view(), name='password_new'),

    # User profile api
    url(r'^profile/$', UserProfileView.as_view(), name='profile'),
    url(r'^profile/change-password/$', PasswordChangeView.as_view(), name='password_change'),
]
