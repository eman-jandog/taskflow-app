# For more information, please refer to https://aka.ms/vscode-docker-python
FROM python:3-slim

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

# Create app directory
WORKDIR /flask-app

# Install pip requirements
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# copy everything
COPY . .

# change dir to mainapp
WORKDIR /flask-app/mainapp

# initialize database
RUN flask db init
RUN flask db migrate -m "initial migration"
RUN flask db upgrade

# back to flask-app
WORKDIR /flask-app

# run commands
CMD ["python3", "run.py"]