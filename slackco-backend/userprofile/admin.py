from django.contrib import admin

from .models import UserProfile, EmailConfirmation, LoginMagicLink, PasswordResetRequest



class EmailConfirmationInline(admin.TabularInline):
    model = EmailConfirmation
    extra = 0


class LoginMagicLinkInline(admin.TabularInline):
	model = LoginMagicLink
	extra = 0


class PasswordResetRequestInline(admin.TabularInline):
	model = PasswordResetRequest
	extra = 0


class UserProfileAdmin(admin.ModelAdmin):
	list_display = ('user', 'company', 'role', 'department',)
	inlines = [EmailConfirmationInline, LoginMagicLinkInline, PasswordResetRequestInline, ]

admin.site.register(UserProfile, UserProfileAdmin)

