# InvokEd

InvokEd is an AI-powered automation tool designed to assist low-resource schools with administrative and educational tasks.

## Getting Started

### Clone the Repository
```sh
git clone https://github.com/Ganesh-P03/InvokEd.git
cd InvokEd/
```

## Running the App

### Setting Up the Server

**Prerequisites:**
- Ensure you have Conda installed. If not, install Conda from [here](https://docs.conda.io/en/latest/miniconda.html).

**Steps:**
```sh
conda create -n testEnv python
conda activate testEnv
pip install -r requirements.txt
```

Navigate to the backend directory:
```sh
cd server/backend/
```

Create a `.env` file and populate it with the following:
```sh
EMAIL_HOST_USER=""
EMAIL_SEND_USER=""
EMAIL_HOST_PASSWORD=""
```

Run the server:
```sh
python manage.py runserver
```

### Setting Up the AI Engine
```sh
cd AIEngine/
```

Create a `.env` file and add your API key:
```sh
GROQ_API_KEY=""
```

Run the AI engine:
```sh
python app.py
```

### Setting Up the Frontend
```sh
cd frontend/
npm i
npm run dev
```

## Contributing
Feel free to submit pull requests or open issues for feature suggestions or bug reports.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

