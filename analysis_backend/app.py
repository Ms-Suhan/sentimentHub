
import re
import joblib

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

# Load the model only once when the server starts
bundle = joblib.load("sentiment_bundle.joblib")
vectorizer = bundle["vectorizer"]
model = bundle["model"]

stop_words = set(stopwords.words("english"))
stemmer = PorterStemmer()

app = FastAPI(
    title="Movie Sentiment API",
    description="Predict whether a movie review is positive or negative",
    version="1.0.0"
)


class PredictionRequest(BaseModel):
    text: str = Field(min_length=1, max_length=10000)


def preprocess(text: str) -> str:
    # Match the preprocessing used during training
    text = re.sub(r"<.*?>", "", text)
    text = text.lower()

    text = "".join(
        char if char.isalnum() else " "
        for char in text
    )

    words = [
        word for word in text.split()
        if word not in stop_words
    ]

    words = [stemmer.stem(word) for word in words]

    return " ".join(words)


@app.get("/")
def home():
    return {
        "message": "Movie Sentiment API is running",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict_sentiment(request: PredictionRequest):
    if not request.text.strip():
        raise HTTPException(
            status_code=422,
            detail="Text cannot be empty"
        )

    cleaned_text = preprocess(request.text)

    features = vectorizer.transform([cleaned_text])
    prediction = int(model.predict(features)[0])

    label = "positive" if prediction == 1 else "negative"

    probabilities = model.predict_proba(features)[0]
    classes = model.classes_

    return {
        "input": request.text,
        "cleaned_text": cleaned_text,
        "sentiment": label,
        "confidence": (round(
            float(max(probabilities)), 4
        ) * 100)
    }
