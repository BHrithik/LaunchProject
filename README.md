To run this project, there are certain requirements.
-> Have Python, Tailwind CSS.


Set up - 
Install Tailwind CSS (Google search or [Tailwindcss.com](https://tailwindcss.com/docs/installation) )

Install requirements -
  Install django channels

  Run command "python -m pip install -U channels["daphne"]"

  Navigate to the folder where you have requirements.txt
  Run command "pip3 install -r requirements.txt"

Running the project -
Run tailwind css in another terminal window:-
run command "npx tailwindcss -i ./static/css/main.css -o ./static/css/main.min.css --watch"

Run the django commands in order:-
django manage.py makemigrations
django manage.py migrate
django manage.py runserver

To create superuser:- (To access django admin potal)
django manage.py createsuperuser
