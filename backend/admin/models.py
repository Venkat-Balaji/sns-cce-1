from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Job(models.Model):
    WORK_TYPE_CHOICES = [
        ('remote', 'Remote'),
        ('hybrid', 'Hybrid'),
        ('on-site', 'On-Site'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('draft', 'Draft'),
    ]

    # Basic Information
    job_title = models.CharField(max_length=200)
    
    # Company Information
    company_name = models.CharField(max_length=200)
    company_overview = models.TextField()
    
    # Job Details
    role_summary = models.TextField()
    key_responsibilities = models.TextField()
    
    # Qualifications
    required_skills = models.TextField()
    education_requirements = models.TextField()
    experience_level = models.CharField(max_length=100)
    
    # Compensation
    salary_range = models.CharField(max_length=100)
    benefits = models.TextField()
    
    # Location and Schedule
    job_location = models.CharField(max_length=200)
    work_type = models.CharField(
        max_length=20,
        choices=WORK_TYPE_CHOICES,
        default='on-site'
    )
    work_schedule = models.TextField()
    
    # Application Details
    application_instructions = models.TextField()
    application_deadline = models.DateField()
    
    # Contact Information
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    
    # Metadata
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_jobs'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )
    views = models.IntegerField(default=0)
    pinned = models.BooleanField(default=False)
    
    # Optional file attachment
    notification_pdf = models.FileField(
        upload_to='job_notifications/',
        null=True,
        blank=True
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.job_title} at {self.company_name}" 