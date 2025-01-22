#!/bin/bash


python manage.py makemigrations flowcharts

python manage.py migrate

python manage.py runserver 0.0.0.0:8000