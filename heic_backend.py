from flask import Flask, request, send_file, jsonify
from PIL import Image
import io
import os
import datetime

# Optional CORS for local dev
try:
    from flask_cors import CORS
except ImportError:
    CORS = None

# MongoDB (PyMongo)
try:
    from pymongo import MongoClient
except ImportError:
    MongoClient = None

# File type detection
def detect_heic_file(file_bytes, filename):
    """Simple HEIC detection based on file signature and extension"""
    # Check file extension
    if filename and filename.lower().endswith(('.heic', '.heif')):
        return True
    
    # Check HEIC file signature (first few bytes)
    if len(file_bytes) >= 12:
        # HEIC files typically start with specific byte patterns
        heic_signatures = [
            b'ftypheic',  # HEIC
            b'ftypmif1',  # HEIF
            b'ftypheix',  # HEIC variant
        ]
        for sig in heic_signatures:
            if sig in file_bytes[:20]:
                return True
    
    return False

app = Flask(__name__)

# Enable CORS in development
if CORS:
    CORS(app, resources={r"/*": {"origins": ["*"]}})  # Allow all origins for production

# Load .env if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

# Setup MongoDB client if available
mongo_client = None
mongo_db = None
mongo_col = None
MONGO_URI = os.getenv('MONGO_URI')
MONGO_DB = os.getenv('MONGO_DB', 'imageconvertpro')
MONGO_COLLECTION = os.getenv('MONGO_COLLECTION', 'conversions')
if MongoClient and MONGO_URI:
    try:
        # Short server selection to avoid long waits during health checks
        mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
        mongo_db = mongo_client[MONGO_DB]
        mongo_col = mongo_db[MONGO_COLLECTION]
        print(f"[MongoDB] Connected to {MONGO_DB}.{MONGO_COLLECTION}")
    except Exception as e:
        print('[MongoDB] Connection failed:', e)

@app.route('/convert', methods=['POST'])
def convert_image():
    if 'file' not in request.files:
        print('No file uploaded')
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    print(f"Received file: {file.filename}, Content-Type: {file.content_type}, Size: {file.content_length}")
    target_format = request.form.get('format', 'jpg').lower()
    if target_format not in ['jpg', 'jpeg', 'png']:
        print(f"Invalid target format: {target_format}")
        return jsonify({'error': 'Invalid target format'}), 400

    try:
        file_bytes = file.read()
        print(f"File bytes length: {len(file_bytes)}")

        # Check if it's a HEIC/HEIF file
        if detect_heic_file(file_bytes, file.filename):
            print("HEIC file detected")
            return jsonify({
                'error': 'HEIC files require special libraries not available in this cloud deployment.',
                'suggestion': 'Please convert HEIC to JPG/PNG first using your device\'s built-in converter.',
                'supported_formats': ['JPG', 'JPEG', 'PNG', 'GIF', 'BMP', 'TIFF', 'WEBP']
            }), 400

        # Handle regular image formats (JPG, PNG, etc.)
        try:
            image = Image.open(io.BytesIO(file_bytes))
            print(f"Image opened: mode={image.mode}, size={image.size}")
        except Exception as e:
            print(f"Failed to open image: {e}")
            return jsonify({'error': 'Invalid image file or unsupported format'}), 400
        
        img_io = io.BytesIO()
        if target_format in ['jpg', 'jpeg']:
            image = image.convert('RGB')
            print("Converted image to RGB for JPEG output")
            image.save(img_io, 'JPEG', quality=95)
            ext = 'jpg'
        else:
            image.save(img_io, 'PNG')
            ext = 'png'
        img_io.seek(0)
        print(f"Image saved to buffer as {ext}, buffer size: {img_io.getbuffer().nbytes}")
        return send_file(img_io, mimetype=f'image/{ext}', as_attachment=True, download_name=f'converted.{ext}')
    except Exception as e:
        import traceback
        print('Exception during conversion:', str(e))
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/healthz', methods=['GET'])
def healthz():
    # Don't call bool() on a PyMongo Collection; compare with None explicitly.
    mongo_ok = False
    mongo_error = None
    # Use the client admin DB to ping; avoid truth tests on Database/Collection
    if mongo_client is not None:
        try:
            mongo_client.admin.command('ping')
            mongo_ok = True
        except Exception as e:
            mongo_ok = False
            mongo_error = str(e)
    status = {
        'status': 'ok',
        'image_formats': ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff'],
        'heic_support': False,  # Disabled for cloud deployment
        'mongo': mongo_ok,
        'mongo_error': mongo_error
    }
    return jsonify(status)


@app.route('/log-conversion', methods=['POST'])
def log_conversion():
    # Avoid truthiness on Collection
    if mongo_col is None:
        return jsonify({'error': 'MongoDB not configured'}), 501
    data = request.get_json(silent=True) or {}
    try:
        doc = {
            'user_id': data.get('userId') or data.get('user_id'),
            'file_name': data.get('fileName'),
            'source_format': (data.get('sourceFormat') or '').lower(),
            'target_format': (data.get('targetFormat') or '').lower(),
            'file_size': data.get('fileSize'),
            'status': data.get('status', 'completed'),
            'created_at': datetime.datetime.utcnow()
        }
        mongo_col.insert_one(doc)
        return jsonify({'ok': True}), 200
    except Exception as e:
        print('[MongoDB] insert error:', e)
        return jsonify({'error': str(e)}), 500


@app.route('/history', methods=['GET'])
def history():
    # Avoid truthiness on Collection
    if mongo_col is None:
        return jsonify({'error': 'MongoDB not configured'}), 501
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
    try:
        cursor = mongo_col.find({'user_id': user_id}).sort('created_at', -1).limit(200)
        data = []
        for d in cursor:
            d['_id'] = str(d.get('_id'))
            data.append(d)
        return jsonify({'ok': True, 'data': data}), 200
    except Exception as e:
        print('[MongoDB] query error:', e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
