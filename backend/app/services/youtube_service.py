import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Scopes needed for uploading to YouTube
SCOPES = ['https://www.googleapis.com/auth/youtube.upload']

# Path to the secrets directory at the root of the backend folder
SECRETS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'secrets')
CLIENT_SECRET_FILE = os.path.join(SECRETS_DIR, 'client_secret.json')
TOKEN_FILE = os.path.join(SECRETS_DIR, 'token.json')

def get_authenticated_service():
    """
    Authenticate the user and return the YouTube API service.
    """
    creds = None
    
    # Ensure secrets directory exists
    os.makedirs(SECRETS_DIR, exist_ok=True)

    # The file token.json stores the user's access and refresh tokens
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
        
    # If there are no valid credentials available, let the user log in
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CLIENT_SECRET_FILE):
                raise FileNotFoundError(f"Missing OAuth client secret file at {CLIENT_SECRET_FILE}. Please download it from Google Cloud Console and place it in the backend/secrets folder.")
            
            # This opens the browser for the OAuth flow
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
            
        # Save the credentials for the next run
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())

    # Build and return the YouTube Data API v3 service client
    return build('youtube', 'v3', credentials=creds)

def upload_video(video_path: str, title: str, description: str, tags: list[str]) -> str:
    """
    Uploads a video to YouTube with private status and returns the video URL.
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found at {video_path}")

    youtube = get_authenticated_service()

    body = {
        'snippet': {
            'title': title,
            'description': description,
            'tags': tags,
            'categoryId': '22' # Category 22 is "People & Blogs"
        },
        'status': {
            'privacyStatus': 'private'
        }
    }

    # Call the API's videos.insert method to upload the video
    insert_request = youtube.videos().insert(
        part=','.join(body.keys()),
        body=body,
        media_body=MediaFileUpload(video_path, chunksize=-1, resumable=True)
    )

    response = insert_request.execute()
    
    video_id = response.get('id')
    return f"https://www.youtube.com/watch?v={video_id}"
