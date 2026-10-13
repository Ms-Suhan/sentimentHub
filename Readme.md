# server start string - ```python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000```

## Docs / Swagger UI - ```http://127.0.0.1:8000/docs#/default/home__get```


# SentimentalHub 🎬

**SentimentalHub** is a full-stack sentiment analysis application that predicts whether a movie review or other short text expresses a **positive** or **negative** sentiment. It combines a React frontend, an Express/Node.js API, MongoDB persistence, and a Python machine-learning API.

> **Project status:** Academic / learning project. Review the configuration and security settings before deploying publicly.

## ✨ Features

- **Sentiment prediction:** Submit text and receive a positive/negative prediction with a confidence score.
- **User authentication:** Register and log in through the Node.js backend.
- **MongoDB storage:** Persist submitted text and prediction results.
- **Separate ML service:** A FastAPI service loads the trained model and exposes a prediction endpoint.
- **Interactive frontend:** React pages for registration, login, and using the application.
- **API documentation:** FastAPI's interactive Swagger UI is available at `/docs`.

## 🧱 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios |
| Application API | Node.js, Express |
| Authentication | JSON Web Tokens (JWT), bcrypt, cookie-parser |
| Database | MongoDB, Mongoose |
| ML API | Python, FastAPI, scikit-learn, NLTK, joblib |
| Model | Saved model bundle: `sentiment_bundle.joblib` |

## 🗂️ Project Structure

```text
sentimentHub-main/
├── analysis_backend/
│   ├── app.py                  # FastAPI sentiment prediction service
│   ├── requirements.txt
│   └── sentiment_bundle.joblib # Trained model and vectorizer
├── backend/
│   ├── src/
│   │   ├── config/             # MongoDB connection
│   │   ├── controllers/        # Authentication/business logic
│   │   ├── middlewares/        # Authentication middleware
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # API routes
│   │   ├── services/
│   │   └── server.js           # Express entry point
│   └── package.json
└── sentiment-frontend/
    ├── src/
    │   ├── pages/              # Home, Login, Register
    │   ├── api.js              # Axios API client
    │   └── App.jsx
    └── package.json
```

## ⚙️ Prerequisites

Install the following before running the project:

- Node.js and npm
- Python 3
- MongoDB (local installation or a MongoDB Atlas cluster)
- Git (optional)

## 🚀 Run Locally

Run each service in a **separate terminal** from the project root.

### 1. Start the machine-learning API

```bash
cd analysis_backend
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python -c "import nltk; nltk.download('stopwords')"
python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

On Windows, activate the virtual environment with:

```powershell
.venv\Scripts\Activate.ps1
```

The model bundle `sentiment_bundle.joblib` must be present in `analysis_backend/`, because the service loads it when `app.py` starts.

Check the service:

- Health/root endpoint: `http://127.0.0.1:8000/health`
- Interactive API docs: `http://127.0.0.1:8000/docs`

### 2. Configure and start the Express backend

Open a second terminal:

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```dotenv
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017
JWT_SECRET=replace_with_a_long_random_secret
```

`MONGODB_URI` should be the MongoDB connection URI **without** the database name; the application appends `/sentimentalhub`. For MongoDB Atlas, use your Atlas connection URI and ensure your network access and database credentials are configured.

Start the API:

```bash
npm start
```

The backend should be available at `http://localhost:3000`.

Useful routes:

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Backend welcome message |
| `GET` | `/api/v1/health` | API health check |
| `POST` | `/api/v1/auth/register` | Register a user |
| `POST` | `/api/v1/auth/login` | Log in |
| `POST` | `/api/v1/predictions` | Submit text for analysis |

The prediction endpoint forwards the text to the ML service at `http://127.0.0.1:8000/predict` and saves the result in MongoDB.

### 3. Configure and start the React frontend

Open a third terminal:

```bash
cd sentiment-frontend
npm install
```

Create a `.env` file inside `sentiment-frontend/`:

```dotenv
VITE_API_URL=http://localhost:3000/api/v1
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal (commonly `http://localhost:5173`).

> Vite exposes variables prefixed with `VITE_` to browser code. Never put database credentials, JWT signing secrets, or other private secrets in the frontend `.env` file.

## 🧪 Test a Prediction

With the Python ML service running, test it directly:

```bash
curl -X POST http://127.0.0.1:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"This movie was excellent and I really enjoyed it"}'
```

The response includes the original input, cleaned text, sentiment label, and confidence percentage. Exact output depends on the trained model.

You can also test the Express prediction route:

```bash
curl -X POST http://localhost:3000/api/v1/predictions \
  -H "Content-Type: application/json" \
  -d '{"text":"This movie was excellent and I really enjoyed it"}'
```

## 🔄 How It Works

1. The user enters text in the React interface.
2. The frontend sends a request to the Express API.
3. Express forwards the text to the FastAPI prediction service.
4. The Python service preprocesses the text using the configured NLTK steps and transforms it with the saved vectorizer.
5. The trained model predicts a sentiment and confidence score.
6. Express stores the text and prediction in MongoDB and returns the result to the frontend.

## 🔐 Security and Configuration Notes

- Use a strong, unique `JWT_SECRET`; do not commit `.env` files.
- Configure CORS to allow only your frontend origin before production deployment.
- Validate request bodies and handle ML-service timeouts/errors in the Express API.
- Use HTTPS and secure cookie settings in production.
- Do not trust a model's confidence score as a guarantee of correctness.
- Only load trusted model artifacts: `joblib` files can execute code when deserialized.

## 🛠️ Troubleshooting

**MongoDB connection fails**
- Confirm MongoDB is running or that your Atlas URI, credentials, and network access are correct.
- Check that `MONGODB_URI` is defined in `backend/.env`.

**The prediction route cannot reach the ML service**
- Start the FastAPI service on port `8000`.
- Check `http://127.0.0.1:8000/health`.
- Confirm the Express service is configured to call the same ML-service URL.

**NLTK stopwords resource is missing**
```bash
python -c "import nltk; nltk.download('stopwords')"
```

**The model bundle cannot be found**
- Start Uvicorn from the `analysis_backend/` directory.
- Confirm `sentiment_bundle.joblib` exists there.

**Frontend requests fail**
- Confirm `VITE_API_URL` in `sentiment-frontend/.env` points to the running Express API.
- Restart Vite after changing `.env`.
- Check browser developer tools and the backend terminal for error details.

## 🌱 Future Improvements

- Add prediction history and per-user analysis views.
- Add automated tests for API routes and model predictions.
- Improve consistent error responses and request validation.
- Add Docker Compose for one-command local setup.
- Deploy the frontend, application API, ML API, and database with environment-specific configuration.

## 👥 Contributors

Developed as a collaborative academic project.

## 📄 License

No license is specified yet. Add a `LICENSE` file before distributing or reusing this project publicly.



