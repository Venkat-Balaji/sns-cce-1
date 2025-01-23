from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from bson import ObjectId
from datetime import datetime
from users.mongodb import (
    db,
    users_collection,
)  # Add job_views_collection
from rest_framework.permissions import IsAuthenticated, IsAdminUser

# Get the jobs collection from the existing db connection
jobs_collection = db["jobs"]

class JobViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def list(self, request):
        try:
            jobs = list(jobs_collection.find())
            # Convert ObjectId to string for JSON serialization
            for job in jobs:
                job["_id"] = str(job["_id"])
            return Response(jobs)
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request):
        try:
            data = request.data
            
            # Create job data matching exactly with your DB schema
            job_data = {
                "title": data.get('title'),
                "company_name": data.get('company_name'),
                "company_overview": data.get('company_overview'),
                "role_summary": data.get('role_summary'),
                "key_responsibilities": data.get('key_responsibilities'),
                "required_skills": data.get('required_skills'),
                "education_requirements": data.get('education_requirements'),
                "experience_level": data.get('experience_level'),
                "salary_range": data.get('salary_range'),
                "benefits": data.get('benefits'),
                "job_location": data.get('job_location'),
                "work_type": data.get('work_type'),
                "work_schedule": data.get('work_schedule'),
                "application_instructions": data.get('application_instructions'),
                "application_deadline": data.get('application_deadline'),
                "contact_email": data.get('contact_email'),
                "contact_phone": data.get('contact_phone'),
                "status": "live",
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
                "views": 0,
                "viewed_by": []
            }

            # Remove empty fields
            job_data = {k: v for k, v in job_data.items() if v is not None}

            result = jobs_collection.insert_one(job_data)
            
            # Fetch and return the created job
            created_job = jobs_collection.find_one({"_id": result.inserted_id})
            created_job["_id"] = str(created_job["_id"])
            
            return Response(created_job, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def retrieve(self, request, pk=None):
        try:
            job = jobs_collection.find_one({"_id": ObjectId(pk)})
            if not job:
                return Response(status=status.HTTP_404_NOT_FOUND)
            
            job["_id"] = str(job["_id"])
            return Response(job)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def update(self, request, pk=None):
        try:
            data = request.data
            
            update_data = {
                "title": data.get('title'),
                "company_name": data.get('company_name'),
                "company_overview": data.get('company_overview'),
                "role_summary": data.get('role_summary'),
                "key_responsibilities": data.get('key_responsibilities'),
                "required_skills": data.get('required_skills'),
                "education_requirements": data.get('education_requirements'),
                "experience_level": data.get('experience_level'),
                "salary_range": data.get('salary_range'),
                "benefits": data.get('benefits'),
                "job_location": data.get('job_location'),
                "work_type": data.get('work_type'),
                "work_schedule": data.get('work_schedule'),
                "application_instructions": data.get('application_instructions'),
                "application_deadline": data.get('application_deadline'),
                "contact_email": data.get('contact_email'),
                "contact_phone": data.get('contact_phone'),
                "updated_at": datetime.now()
            }

            # Remove empty fields
            update_data = {k: v for k, v in update_data.items() if v is not None}

            result = jobs_collection.update_one(
                {"_id": ObjectId(pk)},
                {"$set": update_data}
            )

            if result.modified_count == 0:
                return Response(
                    {"error": "Job not found or no changes made"},
                    status=status.HTTP_404_NOT_FOUND
                )

            updated_job = jobs_collection.find_one({"_id": ObjectId(pk)})
            updated_job["_id"] = str(updated_job["_id"])
            return Response(updated_job)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def destroy(self, request, pk=None):
        try:
            result = jobs_collection.delete_one({"_id": ObjectId(pk)})
            if result.deleted_count == 0:
                return Response(
                    {"error": "Job not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@csrf_exempt
@api_view(["GET", "POST"])
def job_list(request):
    if request.method == "GET":
        try:
            jobs = list(jobs_collection.find())
            # Convert ObjectId to string for JSON serialization
            for job in jobs:
                job["_id"] = str(job["_id"])
                print(jobs)
            return Response(jobs)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    elif request.method == "POST":
        try:
            job_data = request.data
            job_data["created_at"] = datetime.now()
            job_data["updated_at"] = datetime.now()

            # Handle file upload
            if "notification_pdf" in request.FILES:
                # You'll need to implement file handling logic here
                # For now, we'll just store the filename
                job_data["notification_pdf"] = request.FILES["notification_pdf"].name

            result = jobs_collection.insert_one(job_data)
            job_data["_id"] = str(result.inserted_id)

            return Response(job_data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["GET", "PUT", "DELETE"])
def job_detail_admin(request, pk):
    try:
        job = jobs_collection.find_one({"_id": ObjectId(pk)})
        if not job:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if request.method == "GET":
            job["_id"] = str(job["_id"])
            return Response(job)

        elif request.method == "PUT":
            update_data = request.data
            # Remove _id if present in update data
            if "_id" in update_data:
                del update_data["_id"]

            # Update the job
            jobs_collection.update_one({"_id": ObjectId(pk)}, {"$set": update_data})

            # Fetch and return updated job
            updated_job = jobs_collection.find_one({"_id": ObjectId(pk)})
            updated_job["_id"] = str(updated_job["_id"])
            return Response(updated_job)

        elif request.method == "DELETE":
            jobs_collection.delete_one({"_id": ObjectId(pk)})
            return Response(status=status.HTTP_204_NO_CONTENT)

    except Exception as e:
        print(f"Error in job_detail_admin: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(["POST"])
def create_job(request):
    try:
        job_data = request.data
        # Add created_at and updated_at fields
        job_data["created_at"] = datetime.now()
        job_data["updated_at"] = datetime.now()
        job_data["views"] = 0
        job_data["status"] = "live"

        # Insert the job
        result = jobs_collection.insert_one(job_data)

        # Fetch and return the created job
        created_job = jobs_collection.find_one({"_id": result.inserted_id})
        created_job["_id"] = str(created_job["_id"])
        return Response(created_job, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"Error creating job: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(["GET"])
def job_overview(request):
    try:
        current_date = datetime.now()
        print("Current date:", current_date)

        # Debug print to see what's happening
        print(
            "Fetching jobs with status filter:",
            request.query_params.get("status", "live"),
        )

        # Build query based on status
        query = {}
        status_filter = request.query_params.get("status", "live")

        if status_filter != "all":
            if status_filter == "live":
                query["$or"] = [
                    {"end_date": {"$exists": False}},
                    {"end_date": {"$gt": current_date.strftime("%Y-%m-%d")}},
                    {"status": "live"},
                ]
            elif status_filter == "expired":
                query["$or"] = [
                    {"end_date": {"$lt": current_date.strftime("%Y-%m-%d")}},
                    {"status": "expired"},
                ]

        print("MongoDB query:", query)

        # Fetch all jobs
        jobs = list(jobs_collection.find(query))

        # Process jobs
        for job in jobs:
            job["_id"] = str(job["_id"])
            if "views" not in job:
                job["views"] = 0
            if "status" not in job:
                job["status"] = (
                    "live"
                    if not job.get("end_date")
                    or datetime.strptime(job["end_date"], "%Y-%m-%d") >= current_date
                    else "expired"
                )
            if "department" not in job and "category" in job:
                job["department"] = job["category"]

        return Response(jobs)
    except Exception as e:
        print(f"Error in job_overview: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(["GET"])
def job_overview_detail(request, pk):
    try:
        # Fetch specific fields for a single job using MongoDB projection
        job = jobs_collection.find_one(
            {"_id": ObjectId(pk)},
            {
                "title": 1,
                "department": 1,
                "location": 1,
                "description": 1,
                "application_link": 1,
                "views": 1,
                "_id": 1,
            },
        )

        if not job:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Convert ObjectId to string for JSON serialization
        job["_id"] = str(job["_id"])

        return Response(job)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_job(request, job_id):
    try:
        user_id = request.data.get('user_id')
        
        # Check if job exists
        job = jobs_collection.find_one({"_id": ObjectId(job_id)})
        if not job:
            return Response(
                {"error": "Job not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Add to saved_jobs collection
        saved_job = {
            "user_id": user_id,
            "job_id": job_id,
            "saved_at": datetime.now()
        }
        
        # Check if already saved
        existing = saved_jobs_collection.find_one({
            "user_id": user_id,
            "job_id": job_id
        })
        
        if not existing:
            saved_jobs_collection.insert_one(saved_job)

        return Response({"message": "Job saved successfully"})
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unsave_job(request, job_id):
    try:
        user_id = request.data.get('user_id')
        
        result = saved_jobs_collection.delete_one({
            "user_id": user_id,
            "job_id": job_id
        })
        
        if result.deleted_count == 0:
            return Response(
                {"error": "Job was not saved"}, 
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({"message": "Job unsaved successfully"})
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_saved_jobs(request, user_id):
    try:
        # Get all saved job IDs for the user
        saved = saved_jobs_collection.find({"user_id": user_id})
        saved_job_ids = [ObjectId(item["job_id"]) for item in saved]
        
        # Get the actual job details
        saved_jobs = list(jobs_collection.find({
            "_id": {"$in": saved_job_ids}
        }))
        
        # Convert ObjectId to string
        for job in saved_jobs:
            job["_id"] = str(job["_id"])
            
        return Response(saved_jobs)
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@csrf_exempt
@api_view(["POST"])
def toggle_pin_job(request, pk):
    try:
        job = jobs_collection.find_one({"_id": ObjectId(pk)})
        if not job:
            return Response(
                {"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Toggle pinned status
        currently_pinned = job.get("pinned", False)
        jobs_collection.update_one(
            {"_id": ObjectId(pk)},
            {"$set": {"pinned": not currently_pinned}},
        )

        return Response(
            {
                "message": f"Job {'unpinned' if currently_pinned else 'pinned'} successfully",
                "pinned": not currently_pinned,
            }
        )
    except Exception as e:
        logger.error(f"Error toggling pin status: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
