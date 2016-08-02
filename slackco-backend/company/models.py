from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _


class Company(models.Model):
    """
    This model represents Company
    """
    owner = models.ForeignKey(User, related_name="companies_created")

    # basic information
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)

    industry = models.CharField(max_length=200, blank=True, null=True)
    company_type = models.CharField(max_length=200, blank=True, null=True)
    company_size = models.CharField(max_length=200, blank=True, null=True)
    founded = models.SmallIntegerField(blank=True, null=True)

    country = models.CharField(max_length=200, blank=True, null=True)
    state = models.CharField(max_length=200, blank=True, null=True)
    city = models.CharField(max_length=200, blank=True, null=True)
    
    # social profiles
    facebook = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    google_plus = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    youtube = models.URLField(blank=True, null=True)
    github = models.URLField(blank=True, null=True)
    stackoverflow = models.URLField(blank=True, null=True)

    # affiliated companies
    affiliated_companies = models.ManyToManyField('self', blank=True)

    dt_created = models.DateTimeField(auto_now_add=True)
    dt_modified = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Companies"

    def __unicode__(self):
        return self.name


# For MVP, company departments are fixed to bellow, but it would be changed later MVP
COMPANY_DEPARTMENT_CHOICES = (
    ('Management', 'Management'),
    ('PR Department', 'PR Department'),
    ('Dev Department', 'Dev Department'),
    ('UX Department', 'UX Department'),
    ('Law Department', 'Law Department'),
    ('Farmer VR Department', 'Farmer VR Department'),
    ('UI Department', 'UI Department'),
    ('Other', 'Other'),
)


FRIEND_REQUEST_STATUS_CHOICES = (
    (0, 'Created'),
    (1, 'Sent'),
    (2, 'Approved'),
    (3, 'Cancelled'),
)


class FriendCompany(models.Model):
    """
    This model represents friend company
    """
    status = models.SmallIntegerField(choices=FRIEND_REQUEST_STATUS_CHOICES, default=0)
    source_company = models.ForeignKey(Company, related_name="friends_source")
    target_company = models.ForeignKey(Company, related_name="friends_target")

    dt_created = models.DateTimeField(auto_now_add=True)
    dt_modified = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Friend Request"
        verbose_name_plural = "Friend Requests"
        unique_together = (("source_company", "target_company"),)

    def __unicode__(self):
        return "%s vs %s" % (self.source_company.name, self.target_company.name)

    def clean(self):
        # validate if source and target company is same
        if self.source_company == self.target_company:
            raise ValidationError(_("Source and Target company can't be same."))

        # validate if those companies are friends already
        if FriendCompany.objects.filter(source_company=self.target_company, target_company=self.source_company).count() > 0:
            raise ValidationError(_("Friend Request with these companies already exists."))

