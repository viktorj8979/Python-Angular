from django.contrib import admin

from .models import Company, FriendCompany


class CompanyAdmin(admin.ModelAdmin):
	list_display = ('name', 'owner', )

admin.site.register(Company, CompanyAdmin)


class FriendCompanyAdmin(admin.ModelAdmin):
	list_display = ('__unicode__', 'status')
	search_fields = ['source_company__name', 'target_company__name']

admin.site.register(FriendCompany, FriendCompanyAdmin)

