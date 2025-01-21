# Flowchart Management System

This project is a Django-based backend application that provides RESTful APIs to manage flowcharts consisting of nodes and edges. It supports basic CRUD operations as well as additional features like graph validation and querying connected nodes.

## Features

### Core Features
- **Create Flowchart**: Create a new flowchart with nodes and edges.
- **Fetch Flowchart**: Retrieve details of a flowchart by its ID, including its nodes and edges.
- **Update Flowchart**: Add or remove nodes and edges in an existing flowchart.
- **Delete Flowchart**: Delete an existing flowchart by its ID.

### Additional Features
- **Validate Graph**: Validate the structure of the graph (e.g., check for invalid edges).
- **Fetch Outgoing Edges**: Retrieve all outgoing edges for a given node.
- **Fetch Connected Nodes**: Retrieve all nodes directly or indirectly connected to a specific node.

## Technologies Used
- **Django**: Backend framework
- **Django REST Framework (DRF)**: For building APIs
- **SQLite**: Default database (can be replaced with PostgreSQL or MySQL)
- **Docker**: For containerized deployment

## Installation

### Prerequisites
- Python 3.8+
- Virtual Environment (optional but recommended)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/flowchart-management.git
   cd flowchart-management
   ```

2. Set up a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

6. Access the API at: `http://127.0.0.1:8000/api/`

### Admin Panel
1. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```
2. Access the admin panel at: `http://127.0.0.1:8000/admin/`

## API Endpoints

### Flowchart Endpoints
- **List/Create Flowcharts**: `GET/POST /api/flowcharts/`
- **Retrieve/Update/Delete Flowchart**: `GET/PUT/DELETE /api/flowcharts/{id}/`
- **Validate Graph**: `GET /api/flowcharts/{id}/validate_graph/`
- **Fetch Outgoing Edges**: `GET /api/flowcharts/{id}/outgoing_edges/?node_id={node_id}`
- **Fetch Connected Nodes**: `GET /api/flowcharts/{id}/connected_nodes/?node_id={node_id}`

### Example Requests

#### Create a Flowchart
```bash
POST /api/flowcharts/
{
  "title": "Sample Flowchart"
}
```

#### Add Nodes and Edges
1. Create Nodes:
   ```bash
   POST /api/nodes/
   {
     "name": "Node A",
     "flowchart": 1
   }
   ```
2. Create Edges:
   ```bash
   POST /api/edges/
   {
     "source": 1,
     "target": 2,
     "flowchart": 1
   }
   ```

## Running Tests

Run unit tests using the following command:
```bash
python manage.py test
```

## Deployment

### Using Docker
1. Build the Docker image:
   ```bash
   docker build -t flowchart-management .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 8000:8000 flowchart-management
   ```

### Without Docker
Follow the installation steps above, then use a production server like Gunicorn:
```bash
pip install gunicorn
gunicorn projectname.wsgi:application --bind 0.0.0.0:8000
```

## Folder Structure
```
flowchart-management/
|-- flowchart_app/          # Main application
|   |-- migrations/         # Database migrations
|   |-- models.py           # Database models
|   |-- serializers.py      # DRF serializers
|   |-- views.py            # Viewsets and logic
|-- projectname/            # Django project configuration
|-- manage.py               # Django management script
|-- requirements.txt        # Python dependencies
```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a pull request.

## License
This project is licensed under the MIT License. See `LICENSE` for details.

## Acknowledgements
- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)

