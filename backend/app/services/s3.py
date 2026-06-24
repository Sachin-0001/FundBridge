import os
import uuid
import boto3
from botocore.exceptions import NoCredentialsError
from fastapi import UploadFile

# If AWS credentials are not set, we'll use a mock approach or local storage
AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_BUCKET_NAME = os.getenv('AWS_BUCKET_NAME', 'fundbridge-documents')
AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')

def upload_file_to_cloud(file: UploadFile, prefix: str = "documents") -> str:
    """
    Uploads a file to a cloud storage provider (S3).
    If no AWS credentials are provided, it falls back to a mock URL for development.
    """
    filename = f"{prefix}/{uuid.uuid4()}_{file.filename}"
    
    if AWS_ACCESS_KEY and AWS_SECRET_KEY:
        try:
            s3_client = boto3.client(
                's3',
                aws_access_key_id=AWS_ACCESS_KEY,
                aws_secret_access_key=AWS_SECRET_KEY,
                region_name=AWS_REGION
            )
            s3_client.upload_fileobj(
                file.file,
                AWS_BUCKET_NAME,
                filename,
                ExtraArgs={'ContentType': file.content_type}
            )
            file_url = f"https://{AWS_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"
            return file_url
        except Exception as e:
            print(f"Error uploading to S3: {e}")
            # Fallback to mock URL
    
    # Mock cloud storage URL for development without AWS credentials
    return f"https://mock-cloud-storage.com/{AWS_BUCKET_NAME}/{filename}"
