from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'jobs-api', views.JobViewSet, basename='jobs-api')

urlpatterns = [
    path('', include(router.urls)),
    path("jobs-overview/", views.job_overview, name="jobs-overview"),
    path("jobs/", views.create_job, name="create-job"),
    path("jobs/<str:pk>/", views.job_detail_admin, name="job-detail-admin"),
    path("jobs/<str:pk>/toggle-pin/", views.toggle_pin_job, name="toggle-pin-job"),
    path(
        "jobs-overview/<str:pk>/", views.job_overview_detail, name="job-overview-detail"
    ),
    path("jobs/<str:pk>/save/", views.save_job, name="save-job"),
    path("jobs/<str:pk>/unsave/", views.unsave_job, name="unsave-job"),
    path("saved-jobs/<str:user_id>/", views.get_saved_jobs, name="get-saved-jobs"),
    path('users/jobs/<str:job_id>/save/', views.save_job, name='save-job'),
    path('users/jobs/<str:job_id>/unsave/', views.unsave_job, name='unsave-job'),
    path('users/saved-jobs/<str:user_id>/', views.get_saved_jobs, name='get-saved-jobs'),
]
